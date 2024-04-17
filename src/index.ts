#!/usr/bin/env node
import AuroraCSS, { Generator, Lexer, Parser } from "../libs/aurora-preproc";
const woodenlog = require("woodenlog");

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
        .option('-m, --minify', 'Minify the output CSS', false)
        .option('--verbose', 'Verbose output', false)
        .option('-s, --skip-empty', 'Skip empty blocks', false)
        .parse(process.argv);

    let options = args.opts();

    if (args.args.length === 0) {
        woodenlog.error("No files to compile!");
        process.exit(1);
    }

    let combined_files = "";
    for (const file of args.args) {
        let source = fs.readFileSync(file,'utf8');
        let output = "";
        if (options.verbose) {
            woodenlog.log(`Compiling ${file}...`);
        }
        try {
            let generator = new AuroraCSS({ source, output_options: {
                minify_output: options.minify,
                skip_empty_blocks: options.skip_empty
            }});
            output = generator.generate();
            if (options.verbose) {
                woodenlog.log(`Compiled ${file} successfully!`);
            }
        } catch (e: any) {
            woodenlog.error(e);
            process.exit(1);
        }

        if (args.args.length === 1) {
            combined_files = output;
        } else {
            combined_files += `\n/* ----------------------- */\n${output}\n`
        }
    }

    if (options.output === "") {
        console.log("\n")
        console.log(combined_files)
    } else {
        woodenlog.log(`Successfully compiled to CSS!`);
        fs.writeFile(options.output, combined_files,  function(err) {
            if (err) {
                return console.error(err);
            }
    
            woodenlog.log(`File saved to ${options.output}`);
        });
    }
}


main();
