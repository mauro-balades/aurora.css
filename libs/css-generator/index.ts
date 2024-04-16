import { CSSRule } from "./css-rules";

export type CSSBody = Array<CSSRule>;
export interface GenerationOptions {
    minify_output: boolean;
    skip_empty_blocks: boolean;
}

export class CSSGenerator {
    private blocks: CSSBody = [];

    constructor() {}

    public add_block(block: CSSRule) {
        this.blocks.push(block);
        block.genChildren(this);
    }

    public toString(options: GenerationOptions): string {
        let output = "";
        for (const block of this.blocks) {
            output += block.toString(options) + (options.minify_output ? "" : "\n");
        }

        return output;
    }
}

export { CSS } from "./css";
export { CSSRule } from "./css-rules";
export { CSSProperty } from "./properties";