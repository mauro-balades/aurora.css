import { CSSValue } from "./value";
import { CSS } from "./css";

export class CSSProperty extends CSS {
    private readonly name: string;
    private readonly values: CSSValue[];

    private readonly important: boolean;

    constructor(name: string, values: CSSValue[], important: boolean = false) {
        super();

        this.name = name;
        this.values = values;

        this.important = important;
    }
}

