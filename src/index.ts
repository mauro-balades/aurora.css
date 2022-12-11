import Lexer from "../libs/clear-preproc/lexer";

const main = () => {
    // just for now
    let source = `
        x = 1
        y = 5
        x-y-z = 6
        col-z = berry

        @f{
            border: 10px solid black;
            border-radius: 50%;
        }

        .add{
            color:white;
            background-color: rgb(3, 4, 5);
        }

        #ad{
            color: rgb(x, 4, 5);
        }

        .a div a{
            color: ..col-z;
            @f
        }
    `

    let lexer = new Lexer({ content: source });
    let lexerOutput = lexer.tokenize();
    console.log(lexerOutput.tokens);

}


main();
