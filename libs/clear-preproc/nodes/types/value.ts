
import { Node, NodeType } from "..";
import { Position } from "../../position";

export enum ValueType {
    Identifier
};

export class Value extends Node {
    public readonly value_type: ValueType;

    constructor(ty: ValueType, pos: Position) {
        super(NodeType.Value, pos);

        this.value_type = ty;
    }
}

