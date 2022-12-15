import { Position } from "../../../position";
import { Value, ValueType } from "../value";


export class VariableValue extends Value {
    public readonly name: string;

    constructor(name: string, pos: Position) {
        super(ValueType.Variable, pos);
        this.name = name;
    }
}


