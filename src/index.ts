import { Lexer, Parser } from "../libs/clear-preproc";

const main = () => {
    // just for now
    let source = `
    #element {}
    #element.hello {}
    *.hey {}
    .amazing-class#awd {}
    #element .my-element {}
    `

    let lexer = new Lexer({ content: source });
    let lexerOutput = lexer.tokenize();

    let parser = new Parser(lexerOutput)
    let nodes = parser.getNodes();

}


main();
