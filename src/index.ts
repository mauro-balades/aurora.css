import { Generator, Lexer, Parser } from "../libs/aurora-preproc";

const main = () => {
    // just for now
    let source = `
    #element {
        border-top: 2px solid black;

        &.hey & {
            border-top-color: red;

            & input.error {
                border-top-color: red;
            }
        }

        &&&& div & {
            border-top-color: red;
        }
    }
    `

    let lexer = new Lexer({ content: source });
    let lexerOutput = lexer.tokenize();

    let parser = new Parser(lexerOutput)
    let nodes = parser.getNodes();

    let generator = new Generator(nodes, lexerOutput.source);
    generator.generate();
}


main();
