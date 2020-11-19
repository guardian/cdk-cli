import { Imports, importType } from "./imports"

describe("The Imports class", () => {
  describe("addImport function", () => {
    test("adds an import if it doesn't previously exist", () => {
      const imports = new Imports()
      imports.addImport("test", {type: importType.REQUIRE, name: "test"})
      expect(imports.imports).toMatchObject({test: {type: importType.REQUIRE, name: "test"}})
    })

    test("throws an error if the import has already been added using a different style", () => {
      const imports = new Imports()
      imports.addImport("test", {type: importType.REQUIRE, name: "test"})
      expect(() => imports.addImport("test", {type: importType.ALL, name: "test"})).toThrow(`This library has already been added but using a different import type - Current: require Requested: all`)
    })

    test("merges individual components if the import has already been added using component style", () => {
      const imports = new Imports()
      imports.addImport("test", {type: importType.COMPONENT, components: ["one"]})
      expect(imports.imports).toMatchObject({"test": {type: importType.COMPONENT, components: ["one"]}})

      imports.addImport("test", {type: importType.COMPONENT, components: ["two"]})
      expect(imports.imports).toMatchObject({"test": {type: importType.COMPONENT, components: ["one", "two"]}})
    })
  })
})
