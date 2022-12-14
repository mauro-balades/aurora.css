
import { Node, NodeType, Value } from "..";
import { Position } from "../../position";

export type PropertyName = string;

export class Property extends Node {
    public readonly name: PropertyName;
    public readonly values: Value[] = [];

    public important: boolean = false;

    constructor(name: PropertyName, values: Value[], pos: Position) {
        super(NodeType.Property, pos);

        this.name = name;
        this.values = values;
    }
}

