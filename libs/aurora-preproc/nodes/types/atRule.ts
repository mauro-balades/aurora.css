import { Block, Node, NodeType } from "..";
import { AtRuleBase } from "../../at-rules";
import { Position } from "../../position";
import { Selector } from "../../selectors";

export class AtRuleDeclaration extends Node {
    public readonly handle: AtRuleBase;

    constructor(handle: AtRuleBase, pos: Position) {
        super(NodeType.AtRule, pos);

        this.handle = handle;
    }
}
