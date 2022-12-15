import { CSSRule } from "./css-rules";

export type CSSBody = Array<CSSRule>;

export class CSSGenerator {
    private blocks: CSSBody = [];

    constructor() {}

    public add_block(block: CSSRule) {
        this.blocks.push(block);
    }

    public toString(): string {
        let output = "";
        for (const block of this.blocks) {
            output += block.toString() + "\n";
        }

        return output;
    }
}

export { CSS } from "./css";
export { CSSRule } from "./css-rules";
export { CSSProperty } from "./properties";