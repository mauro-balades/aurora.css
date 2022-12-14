import { Position } from "../position";

export enum TokenType {
    IDENTIFIER,

    // Literal values
    VALUE_STRING,

    SYM_AT,            // Symbol: @
    SYM_DOT,           // Symbol: .
    SYM_HASH,          // Symbol: #
    SYM_COMMA,         // Symbol: ,
    SYM_COLLON,        // Symbol: :
    SYM_DOLLAR,        // Symbol: $
    SYM_QUESTION,      // Symbol: ?
    SYM_SEMI_COLLON,   // Symbol: ;

    // |- BRACKETS -|
    BRACKET_LCURLY,    // Symbol: {
    BRACKET_RCURLY,    // Symbol: }
    BRACKET_LPARENT,   // Symbol: (
    BRACKET_RPARENT,   // Symbol: )
    BRACKET_RSQUARED,  // Symbol: [
    BRACKET_LSQUARED,  // Symbol: ]

    // Single characters
    OP_MUL,            // Symbol: *
    OP_MOD,            // Symbol: %
    OP_DIV,            // Symbol: /
    OP_PLUS,           // Symbol: +
    OP_MINUS,          // Symbol: -

    // Single character tokens
    OP_GT,             // Symbol: >
    OP_LT,             // Symbol: <

        // Double character tokens
    OP_EQEQ,           // Symbol: ==
    OP_GTEQ,           // Symbol: >=
    OP_LTEQ,           // Symbol: <=
    OP_NOTEQ,          // Symbol: !=

    // Single character tokens
    OP_EQ,             // Symbol: =
    OP_NOT,            // Symbol: !

    // Double character tokens
    OP_AND,            // Symbol: &&
    OP_OR,             // Symbol: ||

    // Bitwise operations
    OP_BIT_NOT,        // Symbol: ~
    OP_BIT_AND,        // Symbol: &
    OP_BIT_XOR,        // Symbol: ^

    // wtf
    EOF,
    UNKNOWN
}

export class Token {
    public value: string = "";
    public readonly type: TokenType;
    public readonly pos: Position;

    constructor(ty: TokenType, tp: Position) {
        this.type = ty;
        this.pos = tp;

        switch (ty) {
            case TokenType.SYM_AT:             this.value = "@"; break;
            case TokenType.SYM_DOT:            this.value = "."; break;
            case TokenType.SYM_HASH:           this.value = "#"; break;
            case TokenType.SYM_COMMA:          this.value = ","; break;
            case TokenType.SYM_COLLON:         this.value = ":"; break;
            case TokenType.SYM_DOLLAR:         this.value = "$"; break;
            case TokenType.SYM_QUESTION:       this.value = "?"; break;
            case TokenType.SYM_SEMI_COLLON:    this.value = ";"; break;

            // Brackets
            case TokenType.BRACKET_LCURLY:     this.value = "{"; break;
            case TokenType.BRACKET_RCURLY:     this.value = "}"; break;
            case TokenType.BRACKET_LPARENT:    this.value = "("; break;
            case TokenType.BRACKET_RPARENT:    this.value = ")"; break;
            case TokenType.BRACKET_LSQUARED:   this.value = "["; break;
            case TokenType.BRACKET_RSQUARED:   this.value = "]"; break;

            // Equiality
            case TokenType.OP_GT:              this.value = ">"; break;
            case TokenType.OP_LT:              this.value = "<"; break;
            case TokenType.OP_GTEQ:            this.value = ">="; break;
            case TokenType.OP_EQEQ:            this.value = "=="; break;
            case TokenType.OP_LTEQ:            this.value = "<="; break;
            case TokenType.OP_NOTEQ:           this.value = "!="; break;

            // Mathematical symbols
            case TokenType.OP_MOD:             this.value = "%"; break;
            case TokenType.OP_DIV:             this.value = "/"; break;
            case TokenType.OP_MUL:             this.value = "*"; break;
            case TokenType.OP_PLUS:            this.value = "+"; break;
            case TokenType.OP_MINUS:           this.value = "-"; break;

            // Asignment
            case TokenType.OP_EQ:              this.value = "="; break;
            case TokenType.OP_OR:              this.value = "||"; break;
            case TokenType.OP_AND:             this.value = "&&"; break;
            case TokenType.OP_NOT:             this.value = "!"; break;

            // Bitwise operations
            case TokenType.OP_BIT_NOT:         this.value = "~"; break;
            case TokenType.OP_BIT_AND:         this.value = "&"; break;
            case TokenType.OP_BIT_XOR:         this.value = "^"; break;

            // Other
            case TokenType.EOF:    this.value = "<EOF>"; break;

            default:

        }
    }

    public toString(): string {
        return this.value;
    }
}

