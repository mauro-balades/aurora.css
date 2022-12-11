import { LexerOutput } from "../lexer/interfaces";
import { Source } from "../source";
import { Token } from "../tokens";

import { Node } from "../nodes";
import { Position } from "../position";

export default class {
    private readonly source: Source;
    private readonly tokens: Array<Token> = [];

    private nodes: Array<Node> = [];

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

    public throwError(pos: Position): void {
        // TODO:
        console.log("error: ", pos)
    } 

    // private functions

    private isEof(token: Token) {
        return token.pos.col === -1 && token.pos.line === -1
    }

    private parseGlobal(): void {
        for (let i = 0; i < this.tokens.length; i++) {
            let token = this.tokens[i];
            if (this.isEof(token)) {
                break;
            }

            console.log(token)
        }
    }
}
