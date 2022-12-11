import { Position } from "../position";
import { Source } from "../source";
import { LexerOutput } from "./interfaces";
import { Symbols } from "./symbols";
import { Token } from "./tokens";

export default class {
    private readonly source: Source;

    private tokens: Array<Token> = [];
    private pos: Position = { line: 0, col: 0 };

    private lexeme: string = "";

    constructor(source: Source) {
        this.source = source;
    }

    public tokenize(): LexerOutput {
        let content = this.source.content;
        for (let i = 0; i < content.length; i++) {
            let char = content[i];

            if (char !== Symbols.SPACE && char !== Symbols.NEW_LINE) {
                this.lexeme += char;
            } else if (char === Symbols.NEW_LINE) {
                this.pos.line += 1;
                this.pos.col = -1;
            }

            this.pos.col += 1;

            if ((i+1) < content.length) {
                if (
                    (content[i+1] === Symbols.SPACE) ||
                    (Symbols.KEYWORDS.indexOf(content[i+1]) !== -1) ||
                    (content[+1] === Symbols.NEW_LINE)) {

                    if (this.lexeme !== '') {

                        console.log(this.pos)

                        let token = new Token(this.lexeme, { line: this.pos.line, col: (this.pos.col - this.lexeme.length) });
                        this.tokens.push(token);

                        this.lexeme = ''
                    }
                }
            }
        }

        return { tokens: this.tokens } as LexerOutput;
    }
}
