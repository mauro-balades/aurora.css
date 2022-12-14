import { Selector, SelectorType } from ".";
import { FunctionArgument } from "../nodes";
import { Position } from "../position";

export type PseudoName = string;

export class PseudoSelector extends Selector {
    public readonly arguments: FunctionArgument[];

    public has_double_collon: boolean = false;

    constructor(name: PseudoName, pos: Position, _arguments: Array<FunctionArgument> = []) {
        super(SelectorType.PseudoSelector, name, pos);
        this.arguments = _arguments;
    }
}
