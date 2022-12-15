import { Scope, ScopeList, ScopeValue } from "./scopes";

export class Enviroment {
    private scopes: ScopeList = [];

    constructor(global_variables = Scope.default_map()) {
        this.scopes.push(new Scope(global_variables));
    }

    public get(name: string): ScopeValue | undefined {
        let reversed = this.scopes.reverse();
        for (const scope of reversed) {
            let [found, value] = scope.find(name);

            if (found) {
                return value;
            }
        }
    }

    public current_scope(): Scope {
        return this.scopes[this.scopes.length - 1];
    }

    public global_scope(): Scope {
        return this.scopes[0];
    }

    public set(name: string, value: ScopeValue): void {
        let current_scope = this.current_scope();
        current_scope.set(name, value)
    }
}
