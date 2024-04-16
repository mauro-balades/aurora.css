import {describe, expect, test} from '@jest/globals';
import AuroraCSS from "../libs/aurora-preproc";

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
