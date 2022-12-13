
export enum SelectorType {
    Element,
    ID,
    Class,
    Selector,
    Attribute,
    Parent,
    SelectAll, // *
}

export class Selector {
    public readonly type: SelectorType;

    public readonly value: string;
    public with?: Selector[];

    // TODO: add support for "+ ~ >"

    // TODO: node type
    public attribute_value: any;

    constructor(ty: SelectorType, val: string) {
        this.type = ty;
        this.value = val;
    }
}
