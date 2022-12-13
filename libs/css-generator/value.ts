
export enum CSSValueType {

};

export class CSSValue {
    private readonly type: CSSValueType;

    constructor(type: CSSValueType) {
        this.type = type;
    }
}
