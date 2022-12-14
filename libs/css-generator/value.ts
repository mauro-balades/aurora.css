
import { CSS } from "./css";

export enum CSSValueType {
    Identifier
};

export class CSSValue extends CSS {
    private readonly type: CSSValueType;
    private readonly value: string;

    constructor(type: CSSValueType, value: string = "") {
        super();

        this.type = type;
        this.value = value;
    }
}
