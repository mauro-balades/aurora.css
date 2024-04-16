import { CSSValue } from "./value";
import { CSS } from "./css";
import { GenerationOptions } from ".";

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

    public toString(options: GenerationOptions): string {
        let output = `${this.name}:`;

        let i = 0;
        for (const value of this.values) {
            output += value.toString(options);
            if (i < this.values.length - 1) {
                // We must add a space here because the CSSValueList is a list of values
                // example: border: 1px solid red; <- the space is between 1px and solid
                //   is needed to separate the values, avoiding having a value like "1pxsolid"
                output += " ";
            }
            i++;
        }

        if (this.important) {
            output += (options.minify_output ? "" : " ") + "!important"
        }

        return output + ";";
    }
}

