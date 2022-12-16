import { CSSProperty } from "./properties";
import { CSS } from "./css";
import { CSSGenerator } from ".";

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

    public toString(): string {
        let output = "";

        output += this.selector;
        output += " {\n";

        for (const property of this.properties) {
            output += "\t" + property.toString();
        }

        output += "\n}\n";

        return output;
    }
}
