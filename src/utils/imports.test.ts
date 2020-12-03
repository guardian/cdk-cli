import { Imports } from "./imports";

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
});
