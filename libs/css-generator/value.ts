
import { ScopeValue } from "../aurora-preproc/enviroment/scopes";
import { CSS } from "./css";

export enum CSSValueType {
    CssOutput,
    CssValueList
};

export class CSSValue extends CSS {
    private readonly type: CSSValueType;
    private readonly value: string | ScopeValue;

    constructor(type: CSSValueType, value: string | ScopeValue) {
        super();

        this.type = type;
        this.value = value;
    }

    public toString(): string {
        if (this.type === CSSValueType.CssOutput) {
            return " " + this.value as string;
        } else if (this.type === CSSValueType.CssValueList) {
            let values = this.value as ScopeValue;
            let output = "";

            for (let i = 0; i < values.length; i++) {
                const subvalue = values[i];
                output += subvalue.toString();

                if (i < (values.length - 1)) {
                    output += " ";
                }
            }

            return output;
        }

        throw Error("(BUG): CSS value type not handled!");
    }
}
