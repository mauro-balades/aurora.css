import { Position } from "../position";

export enum NodeType {
    None,
}

export abstract class Node {
    public readonly pos: Position;
    public readonly type: NodeType;

    constructor(ty: NodeType = NodeType.None, pos: Position) {
        this.pos = pos;
        this.type = ty;
    }

    public toString(): string { throw Error("To string not defiend in node"); }
}
