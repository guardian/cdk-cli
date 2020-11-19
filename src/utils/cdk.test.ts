import { CodeMaker } from 'codemaker'
import { Config } from './args'
import { CdkBuilder, CDKTemplate } from "./cdk"
import { Imports, importType } from './imports'

const mockedCodeMaker: {[key: string]: jest.Mock} = {
  line: jest.fn(),
  openBlock: jest.fn(),
  closeBlock: jest.fn(),
  indent: jest.fn(),
  unindent: jest.fn(),
}

const clearMockedCodeMaker = (): void => {
  Object.keys(mockedCodeMaker).forEach(key => mockedCodeMaker[key].mockClear())
}

describe("The CdkBuilder class", () => {

  describe("addImport function", () => {
    const builder = new CdkBuilder({} as Config, new Imports(), {} as CDKTemplate)
    builder.code = mockedCodeMaker as unknown as CodeMaker

    beforeEach(clearMockedCodeMaker)

    afterEach(() => {
      builder.imports = new Imports()
    })

    test("pads the imports section with new lines", () => {
      builder.addImports()
      expect(mockedCodeMaker.line.mock.calls[0]).toEqual([])
      expect(mockedCodeMaker.line.mock.calls[2]).toEqual([])
    })

    test("always adds the @aws-cdk/core library", () => {
      builder.addImports()
      expect(mockedCodeMaker.line.mock.calls[1][0]).toEqual(`import cdk = require("@aws-cdk/core")`)
    })

    test("adds ALL style imports correctly", () => {
      const imports = new Imports()
      imports.imports = {
        "test": {
          type: importType.ALL,
          name: "test"
        }
      }
      builder.imports = imports

      builder.addImports()
      expect(mockedCodeMaker.line.mock.calls[2][0]).toEqual(`import * as test from "test"`)
    })

    test("adds REQUIRE style imports correctly", () => {
      const imports = new Imports()
      imports.imports = {
        "test": {
          type: importType.REQUIRE,
          name: "test"
        }
      }
      builder.imports = imports

      builder.addImports()
      expect(mockedCodeMaker.line.mock.calls[2][0]).toEqual(`import test = require("test")`)
    })

    test("adds COMPONENT style imports correctly", () => {
      const imports = new Imports()
      imports.imports = {
        "test": {
          type: importType.COMPONENT,
          components: ["Test"]
        }
      }
      builder.imports = imports

      builder.addImports()
      expect(mockedCodeMaker.line.mock.calls[2][0]).toEqual(`import {Test} from "test"`)

    })
  })

  describe("addParams function", () => {
    const template: CDKTemplate = {
      Parameters: {
        test1: {
          parameterType: "GuParameter",
          type: "String",
          description: "test1"
        },
        test2: {
          parameterType: "GuParameter",
          type: "String",
          description: "test2"
        }
      }
    }
    const mockAddParam = jest.fn()
    const builder = new CdkBuilder({} as Config, new Imports(), template)
    builder.addParam = mockAddParam
    builder.code = mockedCodeMaker as unknown as CodeMaker

    beforeEach(() => {
      clearMockedCodeMaker()
      mockAddParam.mockClear()
    })

    test("adds parameters comments", () => {
      builder.addParams()

      expect(mockedCodeMaker.line.mock.calls[0]).toEqual([])
      expect(mockedCodeMaker.line.mock.calls[1][0]).toBe("/* Parameters */")
      expect(mockedCodeMaker.line.mock.calls[2][0]).toBe("// TODO: Consider if any of the helper classes in components/core/parameters.ts file could be used here")
    })

    test("creates parameters object", () => {
      builder.addParams()

      expect(mockedCodeMaker.openBlock.mock.calls[0][0]).toBe("const parameters =")
      expect(mockedCodeMaker.closeBlock.mock.calls[0]).toEqual([])
    })

    test("adds parameters as required parameters object", () => {
      builder.addParams()
      expect(mockAddParam.mock.calls.length).toBe(2)
      expect(mockAddParam.mock.calls[0]).toEqual(["test1", template.Parameters.test1])
      expect(mockAddParam.mock.calls[1]).toEqual(["test2", template.Parameters.test2])
    })
  })

  describe("addParam function", () => {
    const builder = new CdkBuilder({} as Config, new Imports(), {} as CDKTemplate)
    builder.code = mockedCodeMaker as unknown as CodeMaker

    beforeEach(clearMockedCodeMaker)

    test("opens and closes the parameter correctly", () => {
      builder.addParam("test", {parameterType: "GuParameter"})
      expect(mockedCodeMaker.indent.mock.calls[0][0]).toBe(`test: new GuParameter(this, "test", {`)
      expect(mockedCodeMaker.unindent.mock.calls[0][0]).toBe(`}),`)
    })

    test("a comment is added if it exists", () => {
      builder.addParam("test", {comment: "This is a comment", parameterType: "GuParameter"})
      expect(mockedCodeMaker.line.mock.calls[0][0]).toBe("// This is a comment")
    })

    test("properties are added", () => {
      builder.addParam("test", {parameterType: "GuParameter", description: "test"})
      expect(mockedCodeMaker.line.mock.calls[0][0]).toBe(`description: "test",`)
      expect(mockedCodeMaker.line.mock.calls.length).toBe(1)
    })

  })

  describe("formatParam function", () => {
    const builder = new CdkBuilder({} as Config, new Imports(), {} as CDKTemplate)

    test("formats noEcho values correctly", () => {
      expect(builder.formatParam("noEcho", true)).toBe(true)
    })

    test("formats allowValues values correctly", () => {
      expect(builder.formatParam("allowValues", ["one", "two"])).toBe(`["one","two"]`)
    })

    test("formats other values correctly", () => {
      expect(builder.formatParam("key", "test")).toBe(`"test"`)
    })
  })

  describe("shouldSkipParamProp function", () => {
    const builder = new CdkBuilder({} as Config, new Imports(), {} as CDKTemplate)

    test("returns true if the key is one to skip", () => {
      expect(builder.shouldSkipParamProp("comment", "this is a comment")).toBe(true)
    })

    test("returns false if the key is not one to skip", () => {
      expect(builder.shouldSkipParamProp("description", "this is a description")).toBe(false)
    })

    test("returns true if the type value is String", () => {
      expect(builder.shouldSkipParamProp("type", "String")).toBe(true)
    })

    test("returns false if the type value is not String", () => {
      expect(builder.shouldSkipParamProp("type", "Int")).toBe(false)
    })
  })

})
