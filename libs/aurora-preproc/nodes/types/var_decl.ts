
import { Node, NodeType } from "..";
import { Position } from "../../position";
import { Value } from "./value";

export class VariableDeclaration extends Node {
    public readonly name: string;
    public readonly values: Value[] = [];

    constructor(name: string, values: Value[], pos: Position) {
        super(NodeType.VariableDecl, pos);

        this.name = name;
        this.values = values;
    }
}

