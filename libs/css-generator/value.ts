
import { GenerationOptions } from ".";
import { ScopeValue } from "../aurora-preproc/enviroment/scopes";
import { CSS } from "./css";

export enum CSSValueType {
    CssOutput,
    CssValueList
};

export class CSSValue extends CSS {
    private readonly type: CSSValueType;
    private readonly value: string | ScopeValue;

    public readonly isString: boolean = false;

    constructor(type: CSSValueType, value: string | ScopeValue, isString: boolean = false) {
        super();

        this.type = type;
        this.value = value;

        this.isString = isString;
    }

    public toString(options: GenerationOptions): string {
        if (this.type === CSSValueType.CssOutput) {
            return this.value as string;
        } else if (this.type === CSSValueType.CssValueList) {
            let values = this.value as CSSValue[];
            let output = "";

            for (let i = 0; i < values.length; i++) {
                const subvalue = values[i];
                output += subvalue.toString(options);

                if (i < (values.length - 1)) {
                    output += " ";
                }
            }

            return output;
        }

        throw Error("(BUG): CSS value type not handled!");
    }
}
