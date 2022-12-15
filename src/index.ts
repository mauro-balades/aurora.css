#!/usr/bin/env node
import { Generator, Lexer, Parser } from "../libs/aurora-preproc";

import {Command} from 'commander';
import * as fs from 'fs';

const program = new Command();

const main = () => {
    // just for now
    let args = program
        .version('0.1.0')
        .description('Upload files to a database')
        .command('<path1> [morePaths...]')
        .option('-o, --output [output_file]', 'Output file to render CSS', "out.css")
        .parse(process.argv);

    let options = args.opts();

    let combined_files = "";
    for (const file of args.args) {
        let content = fs.readFileSync(file,'utf8');

        let lexer = new Lexer({ content });
        let lexerOutput = lexer.tokenize();
    
        let parser = new Parser(lexerOutput)
        let nodes = parser.getNodes();
    
        let generator = new Generator(nodes, lexerOutput.source);
        let builder = generator.generate();
    
        let output = builder.toString();
        combined_files += `\n/* FILE SECTION: ${file} */\n${output}\n/* END FILE SECTION: ${file} */`
    }

    fs.writeFile(options.output, combined_files,  function(err) {
        if (err) {
            return console.error(err);
        }

        console.log("Compiled CSS!")
    });
}


main();
