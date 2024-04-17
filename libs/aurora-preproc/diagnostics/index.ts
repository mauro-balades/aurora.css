import { Token } from "../tokens";

export const messages = {
    undefined_token: (tk: Token) => `Undefined token found! ("${tk.toString()}")`,
    unexpected_eof: "Unexpected EOF found!",
    empty_property: "Properties must have atleast one value!",
    unexpected_token: (idnt: string, tok: Token) => `Expected ${idnt} and not "${tok.toString()}"`,
    undefined_variable: (idnt: string) => `The variable "$${idnt}" is not defined!`,

    unexpected_parent_selector: "Parent selector can't be used on global scope!",
    invalid_selector_last: "This selectors must be followed by a selector!",
    invalid_selector_first: "This selectors must be preceded by a selector!",
    namespace_expected_selector: "Namespace selector must (if present) be prefixed only with an identifier!",
}
