import { Position } from "../position";
import { Selector } from "../selectors";

export enum NodeType {
    None,

    CssRule,
    Property,

    Value
}

export type Block = Node[];

export class Node {
    public readonly pos: Position;
    public readonly type: NodeType;

    constructor(ty: NodeType = NodeType.None, pos: Position) {
        this.pos = pos;
        this.type = ty;
    }
}

export { CssNode } from "./types/cssRule";
export { Property } from "./types/property";
export { Value } from "./types/value";

export * as values from "./types/values";