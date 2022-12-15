import { CSSValue } from "../../css-generator/value";


export type ScopeList = Scope[];
export type ScopeValue = Array<CSSValue>;
export type ScopeMap = Map<string, ScopeValue>;

export class Scope {
    private map: ScopeMap;

    constructor(initial_map: ScopeMap = Scope.default_map()) {
        this.map = initial_map;
    }

    // public functions

    public find(name: string): [boolean, ScopeValue] {
        let item = this.map.get(name);
        return [ (typeof item !== "undefined"), (item as ScopeValue) ];
    }

    public set(name: string, value: ScopeValue): void {
        this.map.set(name, value);
    }

    // static functions
    public static default_map(): ScopeMap {
        return new Map<string, ScopeValue>();
    }

}
