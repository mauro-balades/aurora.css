import { CSSProperty } from "./properties";
import { CSS } from "./css";

export class CSSRule extends CSS {
    private properties: CSSProperty[] = [];
    public selector: string = "";

    constructor(selector: string, properties: CSSProperty[]) {
        super();

        this.selector = selector;
        this.properties = properties;
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
