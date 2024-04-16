import { GenerationOptions } from "../../css-generator";
import { CSSValue, CSSValueType } from "../../css-generator/value";
import { Enviroment } from "../enviroment";
import { NativeFunction } from "../enviroment/scopes";
import { Generator } from "../generator";
import { FunctionCallValue } from "../nodes/types/values";

const url = (builder: Generator, node: FunctionCallValue, gen_opts: GenerationOptions, ...args: any): CSSValue => {
    if (args[0].length === 0) {
        builder.throw_error("Expected atleast 1 argument for url().", node.pos);
    }

    let url = args[0][0];
    let compiled = builder.generate_css_value(url);
    return new CSSValue(CSSValueType.CssOutput, `url(${compiled?.toString(gen_opts)})`);
}

const unquote = (builder: Generator, node: FunctionCallValue, gen_opts: GenerationOptions, ...args: any): CSSValue => {
    if (args[0].length !== 1) {
        builder.throw_error("Expected just 1 argument for unquote().", node.pos);
    }

    let arg = args[0][0];   
    let compiled = builder.generate_css_value(arg) as CSSValue;

    let val: string = compiled.toString(gen_opts);
    if (compiled.isString) {
        val = val.slice(1, -1);
    }

    return new CSSValue(CSSValueType.CssOutput, val);
}

export default (env: Enviroment) => {

    env.set("url",     url     as unknown as NativeFunction);
    env.set("unquote", unquote as unknown as NativeFunction);

    // https://www.quackit.com/css/functions/

}
