import { Lexer, Parser } from "../libs/clear-preproc";

const main = () => {
    // just for now
    let source = `
    #element {
        border: 1px solid white;

        & input.error {
            border-color!: red;
        }
    }
    `

    let lexer = new Lexer({ content: source });
    let lexerOutput = lexer.tokenize();

    let parser = new Parser(lexerOutput)
    let nodes = parser.getNodes();

}


main();
