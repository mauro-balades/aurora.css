import { FunctionArgument } from "../..";
import { Position } from "../../../position";
import { Value, ValueType } from "../value";

export class FunctionCallValue extends Value {
    public readonly callee: string;
    public readonly args: FunctionArgument[];

    constructor(callee: string, args: FunctionArgument[], pos: Position) {
        super(ValueType.FunctionCall, pos);

        this.callee = callee;
        this.args = args;
    }
}


