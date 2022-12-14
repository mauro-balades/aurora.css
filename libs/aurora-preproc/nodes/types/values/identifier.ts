import { Position } from "../../../position";
import { Value, ValueType } from "../value";


export class IdentifierValue extends Value {
    public readonly value: string;

    constructor(value: string, pos: Position) {
        super(ValueType.Identifier, pos);
        this.value = value;
    }
}


