import Lexer from "./lexer";
import Parser from "./parser"
import {Generator} from "./generator"
import { Enviroment } from "./enviroment";

import registerFunctions from "./functions";
import registerAtRules from "./at-rules";
import { GenerationOptions } from "../css-generator";

export {default as Lexer} from "./lexer";
export {default as Parser} from "./parser";
export {Position} from "./position";
export {Source} from "./source";
export {Symbols} from "./symbols";
export {Generator} from "./generator";

export interface AuroraCSSOptions {
    source: string;
    output_options?: GenerationOptions;
};

export default class {
    private readonly content: string;
    private readonly output_options: GenerationOptions;

    constructor({source, output_options}: AuroraCSSOptions) {
        this.content = source;
        this.output_options = output_options || {
            minify_output: true,
            skip_empty_blocks: true
        };
    }

    public generate(): string {

        let lexer = new Lexer({ content: this.content });
        let lexerOutput = lexer.tokenize();

        let enviroment = new Enviroment();
        registerFunctions(enviroment)
        registerAtRules(enviroment)

        let parser = new Parser(lexerOutput, enviroment)
        let nodes = parser.getNodes();

        let generator = new Generator(nodes, lexerOutput.source, enviroment, this.output_options);
        let builder = generator.generate();

        return builder.toString(this.output_options);
    }
}
