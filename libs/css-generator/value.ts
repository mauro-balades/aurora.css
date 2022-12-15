
import { ScopeValue } from "../aurora-preproc/enviroment/scopes";
import { CSS } from "./css";

export enum CSSValueType {
    CssOutput,
    CssValueList
};

export class CSSValue extends CSS {
    private readonly type: CSSValueType;
    private readonly value: string | ScopeValue | undefined;

    constructor(type: CSSValueType, value: string | ScopeValue | undefined) {
        super();

        this.type = type;
        this.value = value;
    }
}
