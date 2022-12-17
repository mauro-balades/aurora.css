import Lexer from "./lexer";
import Parser from "./parser"
import {Generator} from "./generator"

export {default as Lexer} from "./lexer";
export {default as Parser} from "./parser";
export {Position} from "./position";
export {Source} from "./source";
export {Symbols} from "./symbols";
export {Generator} from "./generator";

export default class {
    private readonly content: string;

    constructor(content: string) {
        this.content = content;
    }

    public generate(): string {

        let lexer = new Lexer({ content: this.content });
        let lexerOutput = lexer.tokenize();

        let parser = new Parser(lexerOutput)
        let nodes = parser.getNodes();

        let generator = new Generator(nodes, lexerOutput.source);
        let builder = generator.generate();

        return builder.toString();
    }
}
