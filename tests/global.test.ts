import {describe, expect, test} from '@jest/globals';
import AuroraCSS from "../libs/aurora-preproc";
import { messages } from '../libs/aurora-preproc/diagnostics';

const generate = (source: string) => {
  let generator = new AuroraCSS({ source });
  return generator.generate();
}

describe("Parent selector", () => {
  test("Simple usage", () => {
      let source = `
      .parent {
          &.child {
              color: red;
          }
      }
      `;

      let output = generate(source);
      expect(output).toBe(".parent.child{color:red;}");
  });

  test("Crazy usage", () => {
      let source = `
      .parent#foo {
          &&&& .child {
              color: red;
          }
      }
      `;
      let output = generate(source);
      expect(output).toBe(".parent#foo.parent#foo.parent#foo.parent#foo .child{color:red;}");
    });

  test("Nested usage", () => {
      let source = `
      .parent {
          .child {
              & .grandchild {
                  color: red;
              }
          }
      }
      `;
      let output = generate(source);
      expect(output).toBe(".parent .child .grandchild{color:red;}");
  });

  test("Multiple nested usage", () => {
      let source = `
      .parent {
          .child {
              & .grandchild {
                  color: red;
              }
          }
          & .child {
              color: blue;
          }
      }
      `;
      let output = generate(source);
      expect(output).toBe(".parent .child .grandchild{color:red;}.parent .child{color:blue;}");
  });

  test("Multiple nested usage with parent", () => {
      let source = `
      .parent {
          .child {
              & .grandchild {
                  color: red;
              }
          }
          & .child {
              color: blue;
          }
        }
      `;
      let output = generate(source);
      expect(output).toBe(".parent .child .grandchild{color:red;}.parent .child{color:blue;}");
  });

  test("Elements separated by a comma", () => {
        let source = `
        .parent, .child {
            color: red;
        }
        `;
        let output = generate(source);
        expect(output).toBe(".parent,.child{color:red;}");
    });
});

describe("Pseudo selector", () => {
  test("Simple usage", () => {
      let source = `
      .parent {
          &:hover {
              color: red;
          }
      }
      `;
      let output = generate(source);
      expect(output).toBe(".parent:hover{color:red;}");
  });

  test("With arguments", () => {
      let source = `
      .parent {
          &:nth-child(2n) {
              color: red;
          }
      }
      `;
      let output = generate(source);
      expect(output).toBe(".parent:nth-child(2n){color:red;}");
  });

  test("With multiple arguments", () => {
      let source = `
      .parent {
          &:nth-child(2n, 3n) {
              color: red;
          }
      }
      `;
      let output = generate(source);
      expect(output).toBe(".parent:nth-child(2n,3n){color:red;}");
  });

  test("With multiple arguments and spaces", () => {
      let source = `
      .parent {
          &:nth-child(2n, 3n) {
              color: red;
          }
      }
      `;
      let output = generate(source);
      expect(output).toBe(".parent:nth-child(2n,3n){color:red;}");
  });

  test("With multiple arguments and spaces and pseudo selector", () => {
      let source = `
      .parent {
          &:nth-child(2n, 3n):hover {
              color: red;
          }
      }
      `;
      let output = generate(source);
      expect(output).toBe(".parent:nth-child(2n,3n):hover{color:red;}");
  });

  test("Argument is a selector", () => {
        let source = `
        .parent {
            &:is(.child) {
                color: red;
            }
        }
        `;
        let output = generate(source);
        expect(output).toBe(".parent:is(.child){color:red;}");
    }
  );

    test("Argument is a selector with multiple arguments", () => {
        let source = `
        .parent {
            &:is(.child, #foo) {
                color: red;
            }
        }
        `;
        let output = generate(source);
        expect(output).toBe(".parent:is(.child,#foo){color:red;}");
    });

    test("Argument is a selector used from parent", () => {
        let source = `
        .parent {
            .child {
                &:is(&) {
                    color: red;
                }
            }
        }
        `;
        let output = generate(source);
        expect(output).toBe(".parent .child:is(.parent .child){color:red;}");
    });
});

describe("Namespace selector", () => {
    test("Simple usage", () => {
        let source = `
        html|div {
            color: red;
        }
        `;
        let output = generate(source);
        expect(output).toBe("html|div{color:red;}");
    });

    test("With multiple selectors", () => {
        let source = `
        html|div, html|span {
            color: red;
        }
        `;
        let output = generate(source);
        expect(output).toBe("html|div,html|span{color:red;}");
    });

    test("Elements with no namespace", () => {
        let source = `
        |div {
            color: red;
        }
        `;
        let output = generate(source);
        expect(output).toBe("|div{color:red;}");
    });

    test("Elements with no namespace and multiple selectors", () => {
        let source = `
        |div, |span {
            color: red;
        }
        `;
        let output = generate(source);
        expect(output).toBe("|div,|span{color:red;}");
    });

    test("Elements with wildcard namespace", () => {
        let source = `
        *|div {
            color: red;
        }
        `;
        let output = generate(source);
        expect(output).toBe("*|div{color:red;}");
    });

    test("Elements with parent selector", () => {
        let source = `
        .parent {
            html|& {
                color: red;
            }
        }
        `;
        let output = generate(source);
        expect(output).toBe("html|.parent{color:red;}");
    });

    test("Namespace selector must be prefixed only with an identifier", () => {
        expect(() => {
            let source = `
            #hello|div {
                color: red;
            }
            `;
            generate(source);
        }).toThrowError(messages.namespace_expected_selector);
    });
});
