import { CSSRule } from "./css-rules";

export type CSSBody = Array<CSSRule>;

export class CSSGenerator {
    private output: string = "";
    private blocks: CSSBody = [];

    constructor() {}
}

export { CSS } from "./css";
export { CSSRule } from "./css-rules";
export { CSSProperty } from "./properties";