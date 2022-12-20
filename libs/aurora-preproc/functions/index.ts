import { CSSValue, CSSValueType } from "../../css-generator/value";
import { Enviroment } from "../enviroment";
import { NativeFunction } from "../enviroment/scopes";
import { Generator } from "../generator";
import { Node, Value } from "../nodes";
import { ValueType } from "../nodes/types/value";
import { FunctionCallValue } from "../nodes/types/values";

const url = (builder: Generator, node: FunctionCallValue, ...args: any): CSSValue => {
    if (args[0].length === 0) {
        builder.throw_error("Expected atleast 1 argument for url().", node.pos);
    }

    let url = args[0][0];
    let compiled = builder.generate_css_value(url);
    return new CSSValue(CSSValueType.CssOutput, `url(${compiled?.toString(false)})`);
}

const unquote = (builder: Generator, node: FunctionCallValue, ...args: any): CSSValue => {
    if (args[0].length !== 1) {
        builder.throw_error("Expected just 1 argument for unquote().", node.pos);
    }

    let arg = args[0][0];
    if (arg.value_type !== ValueType.String) {
        builder.throw_error("Expected a string value unquote().", arg.pos);
    }

    let compiled = builder.generate_css_value(arg) as CSSValue;
    return new CSSValue(CSSValueType.CssOutput, compiled.toString(false).slice(1, -1));
}

export default (env: Enviroment) => {

    env.set("url",     url     as unknown as NativeFunction);
    env.set("unquote", unquote as unknown as NativeFunction);

    // https://www.quackit.com/css/functions/

}
