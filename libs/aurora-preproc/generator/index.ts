import { CSS, CSSGenerator, CSSProperty, CSSRule } from "../../css-generator";
import { CSSValue } from "../../css-generator/value";
import { messages } from "../diagnostics";
import { CssNode, Node, NodeType, Property } from "../nodes";
import { Position } from "../position";
import { Selector, SelectorList, SelectorType } from "../selectors";
import { PseudoSelector } from "../selectors/pseudo";
import { Source } from "../source";

export class Generator {
    private readonly nodes: Node[];
    private readonly source: Source;

    private readonly builder: CSSGenerator;
    private state = {
        current_selector_tree: ([] as Array<string>)
    };

    constructor(nodes: Node[], source: Source) {
        this.nodes = nodes;
        this.source = source;

        this.builder = new CSSGenerator();
    }

    // error handling
    public throw_error(message: string, pos: Position) {
        throw Error(`Error generating CSS: ${message} [${pos.line}:${pos.col}]`);
    }

    // public API
    public generate(): CSSGenerator {

        for (const node of this.nodes) {
            this.generate_node(node);
        }

        return this.builder;
    }

    // generating helpers

    private generate_node(node: Node): CSS | undefined{
        if (node.type === NodeType.CssRule) {
            return this.generate_css_rule(node as CssNode);
        } else if (node.type === NodeType.Property) {
            return this.generate_css_property(node as Property);
        }

        this.throw_error(`(BUG) unhandled node found: ${node.type}`, node.pos)
    }

    // utility functions
    private get_parent_selector(): string {
        let res = "";

        for (const selector of this.state.current_selector_tree) {
            res += selector;
        }

        return res;
    }

    private generate_selector(selector: Selector): string {
        let result = "";

        switch (selector.type) {
            case SelectorType.Element: {
                result += `${selector.value}`
                break;
            }

            case SelectorType.ID: {
                result += `#${selector.value}`
                break;
            }
            
            case SelectorType.Class: {
                result += `.${selector.value}`
                break;
            }
            
            case SelectorType.PseudoSelector: {
                result += (selector as PseudoSelector).has_double_collon ? "::" : ":";
                result += selector.value;

                let pseudo = (selector as PseudoSelector);
                if (pseudo.arguments.length > 0) {
                    result += "(";

                    for (let i = 0; i < pseudo.arguments.length; i++) {
                        let value = pseudo.arguments[i];

                        // TODO: add value to function
                        this.throw_error("TODO: pseudo selector arguments", selector.pos)

                        if (i < (pseudo.arguments.length - 1)) {
                            result += `,`;
                        }
                    }

                    result += ")";
                }

                break;
            }

            case SelectorType.Attribute: {
                // TODO:
                this.throw_error("TODO: attributes", selector.pos)
                break;
            }
            
            case SelectorType.Parent: {
                // TODO: (this.state.selector_tree) - get most recent and replace
                if (this.state.current_selector_tree.length === 0) {
                    this.throw_error(messages.unexpected_parent_selector, selector.pos)
                }

                result += this.get_parent_selector();
                break;
            }
            
            case SelectorType.SelectAll: {
                result += `*`
                break;
            }

            default: {
                this.throw_error("(BUG) unexpected selector type", selector.pos);
            }
        }

        for (const joined of selector.with) {
            result += this.generate_selector(joined);
        }

        return result;
    }

    private generate_selectors(selectors: Array<Selector[]>): string {
        let result = "";

        for (let i = 0; i < selectors.length; i++) {
            let selector_list = selectors[i];

            for (let x = 0; x < selector_list.length; x++) {
                let selector = selector_list[x];

                result += this.generate_selector(selector);

                if (x < (selector_list.length - 1)) {
                    result += ` `;
                }
            }

            if (i < (selectors.length - 1)) {
                result += `,`;
            }
        }

        return result;
    }

    // generate nodes
    private generate_css_rule(node: CssNode): CSSRule {
        let properties: Array<CSSProperty> = [];

        let selector = this.generate_selectors(node.selectors);
        this.state.current_selector_tree.push(selector);

        for (const block_node of node.block) {
            let result = this.generate_node(block_node);

            if (result instanceof CSSProperty) {
                properties.push(result);
            }
        }

        this.state.current_selector_tree.pop();

        let rule = new CSSRule(selector, properties);
        return rule;
    }

    private generate_css_property(node: Property): CSSProperty {
        let values: Array<CSSValue> = [];

        throw Error("TODO: css values")

        return new CSSProperty(node.name, values, node.important);
    }
}
