#!/usr/bin/env node
import AuroraCSS, { Generator, Lexer, Parser } from "../libs/aurora-preproc";

import {Command} from 'commander';
import * as fs from 'fs';

const program = new Command();

const main = () => {
    // just for now
    let args = program
        .version('0.1.0')
        .description('Upload files to a database')
        .command('<path1> [morePaths...]')
        .option('-o, --output [output_file]', 'Output file to render CSS', "")
        .parse(process.argv);

    let options = args.opts();

    let combined_files = "";
    for (const file of args.args) {
        let content = fs.readFileSync(file,'utf8');
        let generator = new AuroraCSS(content);
        let output = generator.generate();

        if (args.args.length === 1) {
            combined_files = output;
        } else {
            combined_files += `\n/* ----------------------- */\n${output}\n`
        }
    }

    if (options.output === "") {
        console.log(combined_files)
    } else {
        fs.writeFile(options.output, combined_files,  function(err) {
            if (err) {
                return console.error(err);
            }
    
            console.log("Compiled CSS!")
        });
    }
}


main();
