import { Source } from "../source";
import { LexerOutput } from "./interfaces";
import { Token } from "./tokens";

export default class {
    private readonly source: Source;
    private tokens: Array<Token>;

    constructor(source: Source) {
        this.source = source;
        this.tokens = [];
    }

    public tokenize(): LexerOutput {
        return { tokens: this.tokens } as LexerOutput;
    }
}
