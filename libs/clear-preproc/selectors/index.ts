import { Position } from "../position";
import { PseudoSelector } from "./pseudo";

export enum SelectorType {
    Element,
    ID,
    Class,
    PseudoSelector,
    Attribute,
    Parent,
    SelectAll, // *
}

export class Selector {
    public readonly type: SelectorType;

    public readonly value: string;
    public with?: Selector[];

    public pos: Position;

    // TODO: add support for "+ ~ >"

    constructor(ty: SelectorType, val: string, pos: Position) {
        this.type = ty;
        this.value = val;

        this.pos = pos;
    }
}
