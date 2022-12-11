import { Lexer, Parser } from "../libs/clear-preproc";

const main = () => {
    // just for now
    let source = `#element{
            color:white;
            background-color: rgb(3, 4, 5);
        }

        #element.hey ~ {

        }
    `

    let lexer = new Lexer({ content: source });
    let lexerOutput = lexer.tokenize();

    let parser = new Parser(lexerOutput)
    let nodes = parser.getNodes();

}


main();
