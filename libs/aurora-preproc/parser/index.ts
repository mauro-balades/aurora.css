import { LexerOutput } from "../lexer/interfaces";
import { Source } from "../source";
import { Token, TokenType } from "../tokens";

import { Block, CssNode, FunctionArgument, Node, Property, Value, VariableDeclaration } from "../nodes";
import { Position } from "../position";
import { Selector, SelectorType } from "../selectors";
import { messages } from "../diagnostics";
import { LookAhead } from "./look_ahead";
import { FunctionCallValue, IdentifierValue, StringValue } from "../nodes/types/values";
import { PseudoSelector } from "../selectors/pseudo";
import { VariableValue } from "../nodes/types/values/variable";
import { assert } from "console";

export default class {
    private readonly source: Source;
    private readonly tokens: Array<Token> = [];

    private nodes: Array<Node> = [];

    private token_index: number = 0;
    private current_token!: Token;

    private readonly valid_selectors = [
        TokenType.IDENTIFIER,
        TokenType.OP_MUL,
        TokenType.SYM_COLLON,
        TokenType.BRACKET_LSQUARED,
        TokenType.SYM_HASH,
        TokenType.OP_BIT_AND,
        TokenType.SYM_DOT,
    ];

    // TODO: AtRule class
    private readonly at_rules: Array<any> = [];

    constructor(lexRes: LexerOutput) {
        this.source = lexRes.source;
        this.tokens = lexRes.tokens;
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

        this.consume(TokenType.BRACKET_RCURLY, "}");

        return nodes;
    }

    // helper functions
    private next(): Token {
        this.token_index++;
        this.current_token = this.tokens[this.token_index];

        return this.current_token;
    }

    private previous(): Token {
        this.token_index--;
        this.current_token = this.tokens[this.token_index];

        return this.current_token;
    }

    private consume(ty: TokenType, idnt: string): void {
        if (this.current_token.type === ty) {
            this.next();
        } else {
            this.parser_error(messages.unexpected_token(idnt, this.current_token))
        }
    }

    private peek(offset: number = 1): Token {
        try {
            return this.tokens[this.token_index + offset]
        } catch(_) {
            return this.tokens[this.tokens.length - 1]
        }
    }

    // error handling
    private parser_error(message: string, pos: Position | undefined = undefined) {
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

    private _parse_selectors(trailing: boolean = false): Array<Selector>  {
        let selectors: Array<Selector> = [];

        if (this.current_token.type === TokenType.BRACKET_LCURLY) {
            this.parser_error(messages.unexpected_token("valid selector", this.current_token));
        }

        while (this.current_token.type !== TokenType.BRACKET_LCURLY) {
            let token = this.current_token;
            let selector: Selector;

            // TODO: check for EOF?

            if (token.type === TokenType.IDENTIFIER) {

                let element = token.toString();

                selector = new Selector(SelectorType.Element, element, token.pos);
                selector.with = this._parse_same_element();

                this.next();

            } else if (token.type === TokenType.OP_MUL) {
                selector = new Selector(SelectorType.SelectAll, "*", token.pos);
                selector.with = this._parse_same_element();

                this.next();
            } else if (token.type === TokenType.SYM_COLLON) {
                selector = this._parse_pseudo();
                selector.with = this._parse_same_element();

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
                selector.with = this._parse_same_element();

                this.next();

            } else if (token.type === TokenType.SYM_DOT) {

                token = this.next(); // consume "."
                if (token.type !== TokenType.IDENTIFIER) {
                    this.parser_error(messages.unexpected_token("an indentifier", token))
                }

                let id = token.toString();

                selector = new Selector(SelectorType.Class, id, token.pos);

                selector.with = this._parse_same_element();
                this.next();

            } else if (token.type === TokenType.OP_BIT_AND) {
                selector = new Selector(SelectorType.Parent, "&", token.pos);
                selector.with = this._parse_same_element();

                this.next();
            } else {
                this.parser_error(`BUG in selector parser! (token: "${token.toString()}")`);
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

        let args: Array<FunctionArgument> = []
        if (this.current_token.type === TokenType.BRACKET_LPARENT) {
            args = this._parse_arguments();
            this.consume(TokenType.BRACKET_RPARENT, ")")
        }

        let selector = new PseudoSelector(name, pos, args);
        selector.has_double_collon = has_double_collon;

        this.previous()
        return selector;
    }

    private _parse_arguments(): FunctionArgument[] {
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
                let param = this._parse_value();
                params.push(param);

                if ((this.current_token.type === TokenType.SYM_COMMA) || (this.current_token.type === TokenType.BRACKET_LPARENT)) {
                    this.previous();
                }
            }
        }

        return params;
    }

    private _parse_same_element(): Array<Selector> {
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

            } else {
                this.parser_error(messages.unexpected_token("a valid selector character", token))
            }
        } else {
            this.previous();
        }

        return res;
    }
}
