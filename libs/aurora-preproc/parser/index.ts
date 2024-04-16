import { LexerOutput } from "../lexer/interfaces";
import { Source } from "../source";
import { Token, TokenType } from "../tokens";

import { Block, FunctionArgument, Node } from "../nodes";
import { Property, Value, VariableDeclaration, CssNode } from "../nodes/types";
import { Position } from "../position";
import { Selector, SelectorType } from "../selectors";
import { messages } from "../diagnostics";
import { LookAhead } from "./look_ahead";
import { FunctionCallValue, IdentifierValue, StringValue } from "../nodes/types/values";
import { PseudoSelector } from "../selectors/pseudo";
import { VariableValue } from "../nodes/types/values/variable";
import { assert } from "console";
import { AtRuleDeclaration } from "../nodes/types/atRule";
import { Enviroment } from "../enviroment";
import { CSSPseudoSyntaxType, deduceFromName } from "./css_pseudo";

export default class {
    private readonly source: Source;
    private readonly tokens: Array<Token> = [];

    private nodes: Array<Node> = [];

    private token_index: number = 0;
    private current_token!: Token;

    private readonly enviroment: Enviroment;
    private readonly valid_selectors = [
        TokenType.IDENTIFIER,
        TokenType.OP_MUL,
        TokenType.SYM_COLLON,
        TokenType.BRACKET_LSQUARED,
        TokenType.SYM_HASH,
        TokenType.OP_BIT_AND,
        TokenType.SYM_DOT,
    ];

    constructor(lexRes: LexerOutput, env: Enviroment) {
        this.source = lexRes.source;
        this.tokens = lexRes.tokens;

        this.enviroment = env;
    }

    public getNodes(): Array<Node> {
        this.parseGlobal();
        return this.nodes;
    }

    // private functions
    private isEof(token: Token) {
        return token.type === TokenType.EOF
    }

    private parseGlobal(): void {
        while (this.token_index < this.tokens.length) {
            this.current_token = this.tokens[this.token_index];
            if (this.isEof(this.current_token)) {
                break;
            }

            switch (this.current_token.type) {

                case TokenType.IDENTIFIER:
                case TokenType.OP_MUL:
                case TokenType.SYM_COLLON:
                case TokenType.BRACKET_LSQUARED:
                case TokenType.SYM_HASH:
                case TokenType.OP_BIT_AND:
                case TokenType.SYM_DOT: {
                    // https://www.w3schools.com/cssref/css_selectors.php

                    // Possible results:
                    // #element <- # symbol
                    // .element <- . symbol
                    // element <- identifier
                    // :selector <- : symbol
                    // [attribute] <- [ symbol
                    // &:hover <- & symbol
                    // * <- mul symbol

                    let selectors: Array<Selector[]> = [];
                    let pos = this.current_token.pos;

                    do {
                        let selector = this._parse_selectors();
                        selectors.push(selector)
                    } while (this.current_token.type === (TokenType.SYM_COMMA as TokenType));

                    let block = this.parse_css_block();

                    let node = new CssNode(selectors, block, pos);
                    this.nodes.push(node);

                    break;
                }

                case TokenType.SYM_DOLLAR: {
                    let decl = this._parse_variable_decl();
                    this.nodes.push(decl);

                    break;
                }

                case TokenType.SYM_AT: {
                    let decl = this._parse_at_rule();
                    this.nodes.push(decl);

                    break;
                }

                default: {
                    this.parser_error(messages.undefined_token(this.current_token));
                }
            }
        }
    }

    private parse_css_block(): Block {
        let nodes: Block = [];

        this.consume(TokenType.BRACKET_LCURLY, "{");

        while (this.current_token.type !== TokenType.BRACKET_RCURLY) {
            if (this.isEof(this.current_token)) {
                this.parser_error(messages.unexpected_eof);
            }

            if (this.current_token.type == TokenType.SYM_AT) {
                let decl = this._parse_at_rule();
                nodes.push(decl);
            } else {
                let look_ahead = this._look_for_value();
                if (look_ahead === LookAhead.CssSelector) {
                    let selectors: Array<Selector[]> = [];
                    let pos = this.current_token.pos;
    
                    do {
                        let selector = this._parse_selectors();
                        selectors.push(selector)
                    } while (this.current_token.type === (TokenType.SYM_COMMA as TokenType));
    
                    let block = this.parse_css_block();
    
                    let node = new CssNode(selectors, block, pos);
                    nodes.push(node);
                } else if (look_ahead === LookAhead.CssProperty) {
                    if (this.current_token.type === TokenType.SYM_DOLLAR) {
                        let decl = this._parse_variable_decl();
                        nodes.push(decl);
                    } else {
                        let prop = this._parse_property();
                        nodes.push(prop);
                    }
                }
            }
        }

        this.consume(TokenType.BRACKET_RCURLY, "}");

        return nodes;
    }

    // helper functions
    public next(): Token {
        this.token_index++;
        this.current_token = this.tokens[this.token_index];

        return this.current_token;
    }

    public previous(): Token {
        this.token_index--;
        this.current_token = this.tokens[this.token_index];

        return this.current_token;
    }

    public consume(ty: TokenType, idnt: string): void {
        if (this.current_token.type === ty) {
            this.next();
        } else {
            this.parser_error(messages.unexpected_token(idnt, this.current_token))
        }
    }

    public peek(offset: number = 1): Token {
        try {
            return this.tokens[this.token_index + offset]
        } catch(_) {
            return this.tokens[this.tokens.length - 1]
        }
    }

    public get token() {
        return this.current_token;
    }

    // error handling
    public parser_error(message: string, pos: Position | undefined = undefined): void {
        if (typeof pos === "undefined") {
            pos = this.current_token.pos;
        }

        throw Error(`Error: ${message} [${pos.line}:${pos.col}]`)
    }

    // parsing helper functions (not related to token movement)

    private _look_for_value(): LookAhead {
        let list = [TokenType.BRACKET_LCURLY, TokenType.BRACKET_RCURLY, TokenType.SYM_SEMI_COLLON];

        let peek_offset = 0;
        let last_token = this.current_token;

        while (true) {
            if (this.isEof(last_token)) {
                this.parser_error(messages.unexpected_eof)
            }

            let peek = this.peek(peek_offset);
            if (list.indexOf(peek.type) !== -1) {
                if (peek.type === TokenType.BRACKET_LCURLY)
                    return LookAhead.CssSelector;
                else if (peek.type === TokenType.BRACKET_RCURLY)
                    return LookAhead.EndOfCssBlock;
                else if (peek.type === TokenType.SYM_SEMI_COLLON)
                    return LookAhead.CssProperty;
            }

            peek_offset++;
            last_token = peek;
        }
    }

    // parsing methods

    private _parse_at_rule(): AtRuleDeclaration {
        let name = this.next().toString();
        let pos = this.current_token.pos;

        let rule = this.enviroment.getAtRule(name);

        if (typeof rule === "undefined") {
            this.parser_error(`Undefined at rule with name "${name}"`, pos);
            throw Error(""); // make ts stfu
        }

        rule.parse(this);
        return new AtRuleDeclaration(rule, pos);
    }

    private _parse_variable_decl(): VariableDeclaration {
        let pos = this.current_token.pos;

        this.next();
        if (this.current_token.type !== (TokenType.IDENTIFIER as TokenType)) {
            this.parser_error(messages.unexpected_token("an identifier", this.current_token));
        }

        let name = this.current_token.toString(); this.next();
        this.consume(TokenType.SYM_COLLON, ":");
        let values: Array<Value> = [];

        do {
            values.push(this._parse_value());
            this.next();
        } while (this.current_token.type !== (TokenType.SYM_SEMI_COLLON as TokenType));
        this.next();

        return new VariableDeclaration(name, values, pos);
    }

    private _parse_property(): Property {
        if (this.current_token.type !== TokenType.IDENTIFIER) {
            this.parser_error(messages.unexpected_token("an identifier", this.current_token));
        }

        let pos = this.current_token.pos;
        let name = this.current_token.toString(); this.next();

        let is_important = false;
        if (this.current_token.type === TokenType.OP_NOT) {
            this.next(); is_important = true;
        }

        this.consume(TokenType.SYM_COLLON, ":")

        let properties: Array<Value> = [];
        if (this.current_token.type === TokenType.SYM_SEMI_COLLON) {
            this.parser_error(messages.empty_property, this.next().pos)
        }

        do {
            properties.push(this._parse_value());
            this.next();
        } while (this.current_token.type !== TokenType.SYM_SEMI_COLLON)
        this.next();

        let property = new Property(name, properties, pos);
        property.important = is_important;

        return property;
    }

    // @ts-ignore
    private _parse_value(): Value {
        if (this.current_token.type === TokenType.SYM_DOLLAR) {
            this.next();
            if (this.current_token.type !== (TokenType.IDENTIFIER as TokenType)) {
                this.parser_error(messages.unexpected_token("an identifier", this.current_token));
            }

            return new VariableValue(this.current_token.toString(), this.current_token.pos)
        } else if (this.current_token.type === TokenType.IDENTIFIER && this.peek(1).type === TokenType.BRACKET_LPARENT) {
            let caller = this.current_token.toString();

            this.next();
            let args = this._parse_arguments();

            return new FunctionCallValue(caller, args, this.current_token.pos);
        } else if (this.current_token.type === TokenType.IDENTIFIER) {
            // TODO: also parse numbers (.2px, 9.1, 7rem, ...)
            return new IdentifierValue(this.current_token.toString(), this.current_token.pos)
        } else if (this.current_token.type === TokenType.VALUE_STRING) {
            return new StringValue(this.current_token.toString(), this.current_token.pos)
        } else if (this.current_token.type === TokenType.SYM_HASH) {
            throw Error("TODO: hex values");
        }

        this.parser_error(messages.undefined_token(this.current_token))
    }

    private _parse_selectors(trailing: boolean = false, terminator: TokenType = TokenType.BRACKET_LCURLY): Array<Selector>  {
        let selectors: Array<Selector> = [];

        if (this.current_token.type === terminator) {
            this.parser_error(messages.unexpected_token("valid selector", this.current_token));
        }

        while (this.current_token.type !== terminator) {
            let token = this.current_token;
            let selector: Selector;

            // TODO: check for EOF?

            if (token.type === TokenType.IDENTIFIER) {

                let element = token.toString();

                selector = new Selector(SelectorType.Element, element, token.pos);
                selector.with = this._parse_same_element(terminator);

                this.next();

            } else if (token.type === TokenType.OP_MUL) {
                selector = new Selector(SelectorType.SelectAll, "*", token.pos);
                selector.with = this._parse_same_element(terminator);

                this.next();
            } else if (token.type === TokenType.SYM_COLLON) {
                selector = this._parse_pseudo();
                selector.with = this._parse_same_element(terminator);

                this.next();
            } else if (token.type === TokenType.BRACKET_LSQUARED) {
                // TODO: attributes such as ([id="hey"], etc...)
            } else if (token.type === TokenType.SYM_HASH) {

                token = this.next(); // consume "#"
                if (token.type !== TokenType.IDENTIFIER) {
                    this.parser_error(messages.unexpected_token("an indentifier", token))
                }

                let id = token.toString();

                selector = new Selector(SelectorType.ID, id, token.pos);
                selector.with = this._parse_same_element(terminator);

                this.next();

            } else if (token.type === TokenType.SYM_DOT) {

                token = this.next(); // consume "."
                if (token.type !== TokenType.IDENTIFIER) {
                    this.parser_error(messages.unexpected_token("an indentifier", token))
                }

                let id = token.toString();

                selector = new Selector(SelectorType.Class, id, token.pos);

                selector.with = this._parse_same_element(terminator);
                this.next();

            } else if (token.type === TokenType.OP_BIT_AND) {
                selector = new Selector(SelectorType.Parent, "&", token.pos);
                selector.with = this._parse_same_element(terminator);

                this.next();
            } else if (token.type === TokenType.SYM_COMMA) {
                this.next();
                selectors = [...selectors, ...this._parse_selectors(false, terminator)];
                break;
            } else {
                this.parser_error(messages.unexpected_token("a valid selector character", token));
            }

            // @ts-ignore
            selectors.push(selector);

            if (trailing) {
                break;
            }
        }

        return selectors;
    }

    private _parse_pseudo(): PseudoSelector {
        this.next() // consume ":"
        let pos = this.current_token.pos;

        let has_double_collon: boolean = false;
        if (this.current_token.type === TokenType.SYM_COLLON) {
            has_double_collon =  true; this.next();
        }

        if (this.current_token.type !== TokenType.IDENTIFIER) {
            this.parser_error(messages.unexpected_token("an identifier", this.current_token));
        }

        let name = this.current_token.toString();
        this.next();

        let args: Array<FunctionArgument> = [];
        let pseudoType: CSSPseudoSyntaxType = deduceFromName(name);
        if (this.current_token.type === TokenType.BRACKET_LPARENT) {
            if (pseudoType === 'NoArgument') {
                this.parser_error(messages.unexpected_token("no arguments", this.current_token));
            }
            args = this._parse_arguments(pseudoType === 'Selector');
            this.consume(TokenType.BRACKET_RPARENT, ")")
        } else {
            if (pseudoType !== 'NoArgument') {
                this.parser_error(messages.unexpected_token("(", this.current_token));
            }
        }

        let selector = new PseudoSelector(name, pos, args);
        selector.has_double_collon = has_double_collon;

        this.previous()
        return selector;
    }

    private _parse_arguments(allow_selectors: boolean = false): FunctionArgument[] {
        let params: Array<FunctionArgument> = []
        assert(this.current_token.type === TokenType.BRACKET_LPARENT)

        while (true) {
            if (this.isEof(this.current_token)) {
                this.parser_error(messages.unexpected_eof);
            }

            this.next()
            if (this.current_token.type === TokenType.BRACKET_RPARENT) {
                break;
            } else {
                if (allow_selectors) {
                    let selectors = this._parse_selectors(false, TokenType.BRACKET_RPARENT);
                    params.push(selectors); // _parse_selectors consumes the closing bracket
                } else {
                    let param = this._parse_value();
                    params.push(param);
                    this.next();
                }
                if ((this.current_token.type !== TokenType.SYM_COMMA) && (this.current_token.type as TokenType !== TokenType.BRACKET_RPARENT)) {
                    this.parser_error(messages.unexpected_token("',' or ')'", this.current_token));
                }
                if (this.current_token.type as TokenType === TokenType.BRACKET_RPARENT) {
                    this.previous();
                }
            }
        }

        return params;
    }

    private _parse_same_element(terminator: TokenType): Array<Selector> {
        let res: Array<Selector> = [];

        let last_token = this.current_token;
        if (this.isEof(last_token)) {
            this.parser_error(messages.unexpected_eof);
        }

        let token = this.next();
        let to_add = token.toString().length === 1 ? 1 : last_token.toString().length;

        if ((last_token.pos.line === token.pos.line) && (((last_token.pos.col + to_add) === token.pos.col))) {
            if (this.valid_selectors.indexOf(token.type) !== -1) {
                let selectors = this._parse_selectors(true);

                res.push(...selectors);
                this.previous();

            } else if (token.type !== TokenType.SYM_COMMA && token.type !== terminator) {
                this.parser_error(messages.unexpected_token("a valid selector character", token))
            } else {
                this.previous();
            }
        } else {
            this.previous();
        }

        return res;
    }
}
