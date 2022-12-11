import { Position } from "../position";

export class Token {
    public readonly value: string;
    public readonly pos: Position;

    constructor(val: string, tp: Position) {

        console.log(tp)
        this.value = val;
        this.pos = tp;
    }

    public toString(): string {
        return this.value;
    }
}

