import { Token } from "../tokens";

export const messages = {
    undefined_token: (tk: Token) => `Undefined token found! (${tk.toString()})`,
    unexpected_eof: "Unexpected EOF found!",
    empty_property: "Properties must have atleast one value!",
    unexpected_token: (idnt: string, tok: Token) => `Expected ${idnt} and not "${tok.toString()}"`,
    undefined_variable: (idnt: string) => `The variable "$${idnt}" is not defined!`,

    unexpected_parent_selector: "Paren't selector can't be used on global scope!"
}
