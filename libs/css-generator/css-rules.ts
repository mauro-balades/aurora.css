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
}
