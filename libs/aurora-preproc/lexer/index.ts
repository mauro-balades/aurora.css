import { Position } from "../position";
import { Source } from "../source";
import { LexerOutput } from "./interfaces";
import { Symbols } from "../symbols";
import { Token, TokenType } from "../tokens";

const letters = 'abcdefghijklmnopqrstuvwxyz'

export default class {
    private readonly source: Source;

    private tokens: Array<Token> = [];
    private pos: Position = { line: 1, col: 1 };

    private current_pos: number = 0;

    private readonly KEYWORDS = [
        ...(letters.split("")), ...(letters.toUpperCase().split("")),
        "-", ("1234567890".split("")), "_"
    ]


    constructor(source: Source) {
        this.source = source;
    }

    public tokenize(): LexerOutput {
        let content = this.source.content;
        while (this.current_pos < content.length) {

            switch (this.get()) {
                case ' ':
                case '\t': {
                    this.eat();
                    break;
                }

                case '\n': {
                    this.consume_line();
                    break;
                }

                case '/': {
                    if (this.get(1) === '/') { // comment

                        // Skip characters until we encounter _EOF or NEW_LINE
                        while (this.get() != '\n' && this.current_pos < content.length ) {
                            this.eat();
                        }

                        if (this.get() == '\n') {
                            this.consume_line();
                        }

                    }
                    break;
                }

                case ':': this.consume(TokenType.SYM_COLLON); break;

                case ',': this.consume(TokenType.SYM_COMMA); break;
                case ';': this.consume(TokenType.SYM_SEMI_COLLON); break;
                case '@': this.consume(TokenType.SYM_AT); break;
                case '#': this.consume(TokenType.SYM_HASH);break;
                case '$': this.consume(TokenType.SYM_DOLLAR); break;
                case '?': this.consume(TokenType.SYM_QUESTION); break;
    
                // brackets
                case '(': this.consume(TokenType.BRACKET_LPARENT); break;
                case ')': this.consume(TokenType.BRACKET_RPARENT); break;
                case '{': this.consume(TokenType.BRACKET_LCURLY); break;
                case '}': this.consume(TokenType.BRACKET_RCURLY); break;
                case '[': this.consume(TokenType.BRACKET_LSQUARED); break;
                case ']': this.consume(TokenType.BRACKET_RSQUARED); break;

                // op
                case '=': {
                    if (this.get(1) == '=') this.consume(TokenType.OP_EQEQ, 2);
                    else this.consume(TokenType.OP_EQ);
                    break;
                }

                case '+': this.consume(TokenType.OP_PLUS); break;
                case '-': this.consume(TokenType.OP_MINUS); break;
                case '*': this.consume(TokenType.OP_MUL); break;
                case '%': this.consume(TokenType.OP_MOD); break;

                case '<': {
                    if (this.get(1) == '=') this.consume(TokenType.OP_LTEQ, 2);
                    else this.consume(TokenType.OP_LT);
                    break;
                }

                case '>': {
                    if (this.get(1) == '=') this.consume(TokenType.OP_GTEQ, 2);
                    else this.consume(TokenType.OP_GT);
                    break;
                }

                case '!': {
                    if (this.get(1) == '=') this.consume(TokenType.OP_NOTEQ, 2);
                    else this.consume(TokenType.OP_NOT);
                    break;
                }

                case '~':
                    this.consume(TokenType.OP_BIT_NOT);
                    break;
                case '|': {
                    if (this.get(1) == '|') {
                        this.consume(TokenType.OP_OR, 2);
                        break;
                    }
                }
                case '&': {
                    this.consume(TokenType.OP_BIT_AND);
                    break;
                }
                case '^': {
                    this.consume(TokenType.OP_BIT_XOR);
                    break;
                }

                case '.': {
                    this.consume(TokenType.SYM_DOT);
                    break;
                }
    
                case '"': {
                    let current_pos = this.pos;
                    this.eat();

                    let str = "";
                    while (this.get() != '"') {
                        if (this.get() == '\\') {
                            let c = this.get(1);
    
                            switch (c) {
                                case '\\': str += '\\'; this.eat(1); break;
                                case '\'': str += '\''; this.eat(1); break;
                                case 't':  str += '\t'; this.eat(1); break;
                                case 'n':  str += '\n'; this.eat(1); break;
                                case '"':  str += '"';  this.eat(1); break;
                                case 'r':  str += '\r'; this.eat(1); break;
                                case '\n': this.eat(); this.consume_line(); break;
                            }
                        } else {
                            str += this.get(0);
                            if (this.get(0) == '\n') { this.consume_line() }
                            else { this.eat() }
                        }
                    }

                    this.eat()

                    let token = new Token(TokenType.VALUE_STRING, { col: current_pos.col, line: current_pos.line });
                    token.value = str;

                    this.tokens.push(token);
    
                    break;
                }

                default: {

                    let current_pos = this.pos;

                    let lexeme = "";

                    while (this.current_pos < content.length) {
                        let char = this.get();

                        if (char !== Symbols.SPACE && char !== Symbols.NEW_LINE) {
                            lexeme += char;
                        } else if (char === Symbols.NEW_LINE) {
                            this.pos.line += 1;
                            this.pos.col = -1;
                        }

                        this.pos.col += 1;

                        if ((this.current_pos+1) < content.length) {
                            if (
                                (content[this.current_pos+1] === " ") ||
                                (this.KEYWORDS.indexOf(content[this.current_pos+1]) === -1) ||
                                (content[+1] === "\n")) {

                                if (lexeme !== '') {
                                    break;
                                }
                            }
                        }

                        this.current_pos += 1;
                    }

                    let token = new Token(TokenType.IDENTIFIER, { col: current_pos.col, line: current_pos.line });
                    token.value = lexeme;

                    this.eat();
                    this.tokens.push(token);
                }
            }
        }

        // eof
        this.tokens.push(new Token(TokenType.EOF, { line: -1, col: -1 }));
        return { tokens: this.tokens, source: this.source } as LexerOutput;
    }

    private get(offset: number = 0): string {
        return this.source.content[this.current_pos + offset]
    }

    private consume(ty: TokenType, size: number = 1) {
        let token = new Token(ty, { col: this.pos.col, line: this.pos.line });
        this.tokens.push(token);

        this.eat(size - 1);
    }

    private consume_line(): void {
        this.pos.line += 1;
        this.pos.col = 1;

        this.current_pos += 1;
    }

    private eat(offset: number = 0): void {
        this.current_pos += (1 + offset);
        this.pos.col += (1 + offset);
    }
}
