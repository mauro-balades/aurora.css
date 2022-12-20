import { Position } from "../../../position";
import { Value, ValueType } from "../value";

export class StringValue extends Value {
    public readonly value: string;

    constructor(value: string, pos: Position) {
        super(ValueType.String, pos);
        this.value = value;
    }
}


