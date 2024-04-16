import { Block, Node, NodeType } from "../index";
import { Position } from "../../position";
import { Selector } from "../../selectors";

export class CssNode extends Node {
    public selectors: Array<Selector[]> = [];
    public block: Block = [];

    constructor(selectors: Array<Selector[]>, block: Block, pos: Position) {
        super(NodeType.CssRule, pos);

        this.selectors = selectors;
        this.block = block;
    }
}
