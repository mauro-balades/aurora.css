import { Position } from "../position";
import { Selector } from "../selectors";

export enum NodeType {
    None,

    CssRule,
    Property,

    Value,
    VariableDecl,

    AtRule,
}

export type Block = Node[];
export type FunctionArgument = Node | Selector[];

export class Node {
    public readonly pos: Position;
    public readonly type: NodeType;

    constructor(ty: NodeType = NodeType.None, pos: Position) {
        this.pos = pos;
        this.type = ty;
    }
}
