import { AtRuleBase } from "./base";
import { Parser } from "..";
import {Generator} from "../generator";
import { Token, TokenType } from "../tokens";

export default class extends AtRuleBase {
    public override readonly name = "function";

    public override parse(parser: Parser) {
        parser.next(); // Parse "@"

        let name = parser.token.toString();
        parser.consume(TokenType.IDENTIFIER, "an identifier");

        parser.consume(TokenType.BRACKET_LPARENT, "'('")
        // TODO: args
        parser.consume(TokenType.BRACKET_RPARENT, "')'")

        parser.consume(TokenType.BRACKET_LCURLY, "'{'")
        parser.consume(TokenType.BRACKET_RCURLY, "'}'")

    }

    public override generate(generator: Generator) {

    }
}
