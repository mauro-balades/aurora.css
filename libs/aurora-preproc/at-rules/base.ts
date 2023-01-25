import Parser from "../parser";
import {Generator} from "../generator";

export abstract class AtRuleBase {
    constructor() {}

    // Context may depend on the type of at symbol.
    private _context: any = {};

    public readonly name: String = "<BUG>";

    public parse(parser: Parser) { throw Error("At rule base not implemented (parse)") }
    public generate(generator: Generator) { throw Error("At rule base not implemented (generate)") }
}