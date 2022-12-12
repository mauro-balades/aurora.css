import { Token } from "../tokens";

export const messages = {
    undefined_token: (tk: Token) => `Undefined token found! (${tk.toString()})`,
    unexpected_eof: "Unexpected EOF found!",
    unexpected_token: (idnt: string, tok: Token) => `Expected ${idnt} and not "${tok.toString()}"`
}
