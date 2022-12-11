
export enum TokenType {

}

export class Token {
    public readonly type: TokenType;
    constructor(ty: TokenType) {
        this.type = ty;
    }

    public toString(): string {
        // TODO:
        return "todo";
    }
}

