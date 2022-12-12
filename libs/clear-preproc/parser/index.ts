import { LexerOutput } from "../lexer/interfaces";
import { Source } from "../source";
import { Token, TokenType } from "../tokens";

import { Node } from "../nodes";
import { Position } from "../position";
import { Selector, SelectorType } from "../selectors";
import { messages } from "../diagnostics";

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
                case TokenType.SYM_DOT: {
                    // https://www.w3schools.com/cssref/css_selectors.php

                    // Possible results:
                    // #element <- # symbol
                    // .element <- . symbol
                    // element <- identifier
                    // :selector <- : symbol
                    // [attribute] <- [ symbol
                    // * <- mul symbol

                    let selectors = this._parse_selectors();
                    console.log(selectors)
                    this.consume(TokenType.BRACKET_LCURLY, "{");

                    // (WIP): this is for now.
                    // TODO: delete this when starting with body parsing
                    this.consume(TokenType.BRACKET_RCURLY, "}");

                    break;
                }

                default: {
                    this.parser_error(messages.undefined_token(this.current_token));
                }
            }
        }
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

    private peek(offset: number = 0): Token {
        try {
            return this.tokens[offset]
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

    // parsing methods

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

                selector = new Selector(SelectorType.Element, element);
                selector.with = this._parse_same_element();

                this.next();

            } else if (token.type === TokenType.OP_MUL) {
                selector = new Selector(SelectorType.SelectAll, "*");
                selector.with = this._parse_same_element();

                this.next();
            } else if (token.type === TokenType.SYM_COLLON) {
                // TODO: selectors such as (:not, ::last-child, etc...)
            } else if (token.type === TokenType.BRACKET_LSQUARED) {
                // TODO: attributes such as ([id="hey"], etc...)
            } else if (token.type === TokenType.SYM_HASH) {

                token = this.next(); // consume "#"
                if (token.type !== TokenType.IDENTIFIER) {
                    this.parser_error(messages.unexpected_token("an indentifier", token))
                }

                let id = token.toString();

                selector = new Selector(SelectorType.ID, id);
                selector.with = this._parse_same_element();

                this.next();

            } else if (token.type === TokenType.SYM_DOT) {

                token = this.next(); // consume "."
                if (token.type !== TokenType.IDENTIFIER) {
                    this.parser_error(messages.unexpected_token("an indentifier", token))
                }

                let id = token.toString();

                selector = new Selector(SelectorType.Class, id);
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

    private _parse_same_element(): Array<Selector> {
        let res: Array<Selector> = [];

        while (true) {
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
                    console.log(`^- this selectors: ${JSON.stringify(selectors)}\n`)
                    this.previous();

                    break;
                } else {
                    this.parser_error(messages.unexpected_token("a valid selector character", token))
                }
            } else {
                this.previous();
                break;
            }

        }

        return res;
    }
}
