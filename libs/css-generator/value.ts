
import { CSS } from "./css";

export enum CSSValueType {

};

export class CSSValue extends CSS {
    private readonly type: CSSValueType;

    constructor(type: CSSValueType) {
        super();
        
        this.type = type;
    }
}
