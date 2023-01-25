
import { Enviroment } from "../enviroment";

import FunctionAtRule from "./function";
export {AtRuleBase} from "./base";

export default (env: Enviroment) => {

    env.addAtRule(new FunctionAtRule());

}
