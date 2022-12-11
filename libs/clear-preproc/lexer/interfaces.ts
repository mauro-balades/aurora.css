import { Source } from "../source";
import { Token } from "../tokens";

export interface LexerOutput {
    tokens: Array<Token>;
    source: Source;
}
