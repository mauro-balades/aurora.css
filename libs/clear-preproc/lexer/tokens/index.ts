import { Position } from "../../position";

export class Token {
    public readonly value: string;
    public readonly pos: Position;

    constructor(val: string, tp: Position = { line: 0, col: 0 }) {
        this.value = val;
        this.pos = tp;
    }

    public toString(): string {
        // TODO:
        return "todo";
    }
}

