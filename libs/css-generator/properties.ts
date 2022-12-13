import { CSSValue } from "./value";

export class CSSProperty {
    private readonly name: string;
    private readonly values: CSSValue[];

    constructor(name: string, values: CSSValue[]) {
        this.name = name;
        this.values = values;
    }
}

