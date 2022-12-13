import { Lexer, Parser } from "../libs/clear-preproc";

const main = () => {
    // just for now
    let source = `
    #element::before.div::after {}
    #element:nth-child(2) {}
    `

    let lexer = new Lexer({ content: source });
    let lexerOutput = lexer.tokenize();

    let parser = new Parser(lexerOutput)
    let nodes = parser.getNodes();

    console.log(require("util").inspect(nodes, {showHidden: false, depth: null, colors: true}))
}


main();
