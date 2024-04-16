import { CSSProperty } from "./properties";
import { CSS } from "./css";
import { CSSGenerator, GenerationOptions } from ".";

export class CSSRule extends CSS {
    private properties: CSSProperty[] = [];
    private children: Array<CSSRule> = [];

    public selector: string = "";

    constructor(selector: string, properties: CSSProperty[], children: Array<CSSRule>) {
        super();

        this.selector = selector;
        this.properties = properties;

        this.children = children;
    }

    public genChildren(builder: CSSGenerator) {
        for (const child of this.children) {
            builder.add_block(child);
        }
    }

    public toString(options: GenerationOptions): string {
        let output = "";
        if (this.properties.length === 0 && options.skip_empty_blocks) {
            return output;
        }
        const newLine = options.minify_output ? "" : "\n";
        const tab = options.minify_output ? "" : "\t";
        const space = options.minify_output ? "" : " ";

        output += this.selector;
        output += space + "{" + newLine;

        for (const property of this.properties) {
            output += tab + property.toString(options);
        }

        output += newLine + "}" + newLine;
        return output;
    }
}
