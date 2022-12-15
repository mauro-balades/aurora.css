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

    public toString(): string {
        let output = `${this.name}:`;

        for (const value of this.values) {
            output += value.toString();
        }

        if (this.important) {
            output += " !important"
        }

        return output + ";";
    }
}

