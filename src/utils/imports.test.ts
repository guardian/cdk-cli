import { MockCodeMaker } from "../../test/utils/codemaker";
import {
  Imports,
  newAppImports,
  newStackImports,
  newTestImports,
} from "./imports";

describe("The Imports class", () => {
  describe("addImport function", () => {
    test("adds an import if it doesn't previously exist", () => {
      const imports = new Imports();
      imports.addImport("test", ["one"]);
      expect(imports.imports).toMatchObject({
        test: {
          components: ["one"],
          types: [],
        },
      });
    });

    test("adds a type import if it doesn't previously exist", () => {
      const imports = new Imports();
      imports.addImport("test", ["one"], true);
      expect(imports.imports).toMatchObject({
        test: {
          components: [],
          types: ["one"],
        },
      });
    });

    test("merges individual components if the import has already been added", () => {
      const imports = new Imports();
      imports.addImport("test", ["one"]);
      expect(imports.imports).toMatchObject({
        test: {
          components: ["one"],
          types: [],
        },
      });

      imports.addImport("test", ["two"]);
      expect(imports.imports).toMatchObject({
        test: {
          components: ["one", "two"],
          types: [],
        },
      });
    });

    test("merges individual types if the import has already been added", () => {
      const imports = new Imports();
      imports.addImport("test", ["one"], true);
      expect(imports.imports).toMatchObject({
        test: {
          components: [],
          types: ["one"],
        },
      });

      imports.addImport("test", ["two"], true);
      expect(imports.imports).toMatchObject({
        test: {
          components: [],
          types: ["one", "two"],
        },
      });
    });

    test("does not add type component if normal component exists", () => {
      const imports = new Imports();
      imports.addImport("test", ["one"]);
      expect(imports.imports).toMatchObject({
        test: {
          components: ["one"],
          types: [],
        },
      });

      imports.addImport("test", ["one"], true);
      expect(imports.imports).toMatchObject({
        test: {
          components: ["one"],
          types: [],
        },
      });
    });

    test("moves existing type import to component if added as component", () => {
      const imports = new Imports();
      imports.addImport("test", ["one"], true);
      expect(imports.imports).toMatchObject({
        test: {
          components: [],
          types: ["one"],
        },
      });

      imports.addImport("test", ["one"]);
      expect(imports.imports).toMatchObject({
        test: {
          components: ["one"],
          types: [],
        },
      });
    });
  });

  describe("render function", () => {
    const codemaker = new MockCodeMaker();

    beforeEach(() => codemaker.clear());

    test("adds a blank line at the end of the imports section", () => {
      const imports = new Imports();
      imports.imports = {
        test: {
          types: [],
          components: ["Test"],
        },
      };
      imports.render(codemaker.codemaker);

      expect(codemaker._codemaker.line).toHaveBeenCalledTimes(2);
      expect(codemaker._codemaker.line).toHaveBeenLastCalledWith();
    });

    test("render 'basic' imports correctly", () => {
      const imports = new Imports();
      imports.imports = {
        test: {
          types: [],
          components: [],
          basic: true,
        },
      };
      imports.render(codemaker.codemaker);

      expect(codemaker._codemaker.line).toHaveBeenCalledWith(`import "test";`);
    });

    test("render component imports correctly", () => {
      const imports = new Imports();
      imports.imports = {
        test: {
          types: [],
          components: ["Test"],
        },
      };
      imports.render(codemaker.codemaker);

      expect(codemaker._codemaker.line).toHaveBeenCalledWith(
        `import { Test } from "test";`
      );
    });

    test("render type imports correctly", () => {
      const imports = new Imports();
      imports.imports = {
        test: {
          types: ["Test"],
          components: [],
        },
      };
      imports.render(codemaker.codemaker);

      expect(codemaker._codemaker.line).toHaveBeenCalledWith(
        `import type { Test } from "test";`
      );
    });

    test("render imports in alphabetical order", () => {
      const imports = new Imports();
      imports.imports = {
        b: {
          types: [],
          components: ["B"],
        },
        a: {
          types: [],
          components: ["A"],
        },
      };
      imports.render(codemaker.codemaker);

      expect(codemaker._codemaker.line).toHaveBeenNthCalledWith(
        1,
        `import { A } from "a";`
      );
      expect(codemaker._codemaker.line).toHaveBeenNthCalledWith(
        2,
        `import { B } from "b";`
      );
    });

    test("render 'basic' imports before component imports", () => {
      const imports = new Imports();
      imports.imports = {
        b: {
          types: [],
          components: [],
          basic: true,
        },
        a: {
          types: [],
          components: ["A"],
        },
      };
      imports.render(codemaker.codemaker);

      expect(codemaker._codemaker.line).toHaveBeenNthCalledWith(
        1,
        `import "b";`
      );
      expect(codemaker._codemaker.line).toHaveBeenNthCalledWith(
        2,
        `import { A } from "a";`
      );
    });

    test("render relative imports after absolute imports", () => {
      const imports = new Imports();
      imports.imports = {
        "../a": {
          types: [],
          components: ["A"],
        },
        b: {
          types: [],
          components: ["B"],
        },
      };
      imports.render(codemaker.codemaker);

      expect(codemaker._codemaker.line).toHaveBeenNthCalledWith(
        1,
        `import { B } from "b";`
      );
      expect(codemaker._codemaker.line).toHaveBeenNthCalledWith(
        2,
        `import { A } from "../a";`
      );
    });
  });
});

describe("The newStackImports function", () => {
  test("adds the correct initial imports", () => {
    const imports = newStackImports();

    expect(imports.imports).toEqual({
      "@guardian/cdk/lib/constructs/core": {
        types: ["GuStackProps"],
        components: ["GuStack"],
      },
      "@aws-cdk/core": {
        types: ["App"],
        components: [],
      },
    });
  });
});

describe("The newAppImports function", () => {
  test("adds the correct initial imports", () => {
    const imports = newAppImports({ kebab: "app", pascal: "App" }, false);
    expect(imports.imports["@aws-cdk/core"]).toEqual({
      types: [],
      components: ["App"],
    });

    expect(imports.imports["source-map-support/register"]).toEqual({
      basic: true,
      types: [],
      components: [],
    });
  });

  test("adds the correct stack import when not multiapp", () => {
    const imports = newAppImports({ pascal: "App", kebab: "app" }, false);
    expect(imports.imports["../lib/app"]).toEqual({
      types: [],
      components: ["App"],
    });
  });

  test("adds the correct stack import when multiapp", () => {
    const imports = newAppImports({ pascal: "App", kebab: "app" }, true);
    expect(imports.imports["../lib/app/app"]).toEqual({
      types: [],
      components: ["App"],
    });
  });
});

describe("The newTestImports function", () => {
  test("adds the correct initial imports", () => {
    const imports = newTestImports({ kebab: "stack", pascal: "Stack" });
    expect(imports.imports["@aws-cdk/assert"]).toEqual({
      types: [],
      components: ["SynthUtils"],
    });

    expect(imports.imports["@aws-cdk/core"]).toEqual({
      types: [],
      components: ["App"],
    });

    expect(imports.imports["@aws-cdk/assert/jest"]).toEqual({
      basic: true,
      types: [],
      components: [],
    });
  });

  test("adds the correct stack import", () => {
    const imports = newTestImports({
      pascal: "StackName",
      kebab: "stack-name",
    });
    expect(imports.imports["./stack-name"]).toEqual({
      types: [],
      components: ["StackName"],
    });
  });
});
