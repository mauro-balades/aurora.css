
import { Node, NodeType, Value } from "..";
import { Position } from "../../position";

export class VariableDeclaration extends Node {
    public readonly name: string;
    public readonly values: Value[] = [];

    constructor(name: string, values: Value[], pos: Position) {
        super(NodeType.VariableDecl, pos);

        this.name = name;
        this.values = values;
    }
}

