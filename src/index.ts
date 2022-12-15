import { Generator, Lexer, Parser } from "../libs/aurora-preproc";

const main = () => {
    // just for now
    let source = `
    $color: white;
    #element {
        border-top: 2px solid $color;

        &.hey & {
            border-top-color: red;

            & input.error {
                border-top-color: red;
            }
        }

        $color: red;

        & div {
            border-top-color!: $color;
        }
    }

    .my-div {
        background: $color;
    }
    `

    let lexer = new Lexer({ content: source });
    let lexerOutput = lexer.tokenize();

    let parser = new Parser(lexerOutput)
    let nodes = parser.getNodes();

    let generator = new Generator(nodes, lexerOutput.source);
    let builder = generator.generate();

    let output = builder.toString();
    console.log(output)
}


main();
