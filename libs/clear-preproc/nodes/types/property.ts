
import { Node, NodeType } from "..";
import { Position } from "../../position";

export type PropertyName = string;

export class Property extends Node {
    public readonly name: PropertyName;
    public readonly values: Node[] = [];

    public important: boolean = false;

    constructor(name: PropertyName, values: Node[], pos: Position) {
        super(NodeType.Property, pos);

        this.name = name;
        this.values = values;
    }
}

