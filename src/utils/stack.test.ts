import { MockCodeMaker } from "../../test/utils/codemaker";
import { Imports } from "./imports";
import type { StackTemplate } from "./stack";
import { StackBuilder } from "./stack";

describe("The StackBuilder class", () => {
  describe("addParams function", () => {
    const template: StackTemplate = {
      Parameters: {
        test1: {
          parameterType: "GuParameter",
          type: "String",
          description: "test1",
        },
        test2: {
          parameterType: "GuParameter",
          type: "String",
          description: "test2",
        },
      },
    };
    const mockAddParam = jest.fn();
    const builder = new StackBuilder({
      outputDir: "",
      outputFile: "",
      appName: {
        pascal: "",
        kebab: "",
      },
      imports: new Imports(),
      template,
    });
    builder.addParam = mockAddParam;
    const codemaker = new MockCodeMaker();
    builder.code = codemaker.codemaker;

    beforeEach(() => {
      builder.template = template;
      codemaker.clear();
      mockAddParam.mockClear();
    });

    test("does not render anything if parameters are empty", () => {
      builder.template = {
        Parameters: {},
      };
      builder.addParams();

      expect(codemaker._codemaker.line).toHaveBeenCalledTimes(0);
    });

    test("adds parameters comments", () => {
      builder.addParams();

      expect(codemaker._codemaker.line).toHaveBeenNthCalledWith(1);
      expect(codemaker._codemaker.line).toHaveBeenNthCalledWith(
        2,
        "/* Parameters */"
      );
      expect(codemaker._codemaker.line).toHaveBeenNthCalledWith(
        3,
        "// TODO: Consider if any of the parameter constructs from @guardian/cdk could be used here"
      );
      expect(codemaker._codemaker.line).toHaveBeenNthCalledWith(
        4,
        "// https://github.com/guardian/cdk/blob/main/src/constructs/core/parameters.ts"
      );
    });

    test("creates parameters object", () => {
      builder.addParams();

      expect(codemaker._codemaker.openBlock).toHaveBeenNthCalledWith(
        1,
        "const parameters ="
      );
      expect(codemaker._codemaker.closeBlock).toHaveBeenNthCalledWith(1, "};");
    });

    test("adds parameters as required parameters object", () => {
      builder.addParams();
      expect(mockAddParam).toHaveBeenCalledTimes(2);
      expect(mockAddParam).toHaveBeenNthCalledWith(
        1,
        "test1",
        template.Parameters.test1
      );
      expect(mockAddParam).toHaveBeenNthCalledWith(
        2,
        "test2",
        template.Parameters.test2
      );
    });
  });

  describe("addParam function", () => {
    const builder = new StackBuilder({
      outputDir: "",
      outputFile: "",
      appName: {
        kebab: "",
        pascal: "",
      },
      imports: new Imports(),
      template: {} as StackTemplate,
    });
    const codemaker = new MockCodeMaker();
    builder.code = codemaker.codemaker;

    beforeEach(() => codemaker.clear());

    test("opens and closes the parameter correctly", () => {
      builder.addParam("test", {
        parameterType: "GuParameter",
        description: "test",
      });
      expect(codemaker._codemaker.indent).toHaveBeenNthCalledWith(
        1,
        `test: new GuParameter(this, "test", {`
      );
      expect(codemaker._codemaker.unindent).toHaveBeenNthCalledWith(1, `}),`);
    });

    test("a comment is added if it exists", () => {
      builder.addParam("test", {
        comment: "This is a comment",
        parameterType: "GuParameter",
      });
      expect(codemaker._codemaker.line).toHaveBeenNthCalledWith(
        1,
        "// This is a comment"
      );
    });

    test("properties are added", () => {
      builder.addParam("test", {
        parameterType: "GuParameter",
        description: "test",
      });
      expect(codemaker._codemaker.line).toHaveBeenNthCalledWith(
        1,
        `description: "test",`
      );
      expect(codemaker._codemaker.line).toHaveBeenCalledTimes(1);
    });

    test("renders on one line if there are no props", () => {
      builder.addParam("test", {
        parameterType: "GuParameter",
      });
      expect(codemaker._codemaker.line).toHaveBeenNthCalledWith(
        1,
        `test: new GuParameter(this, "test", {}),`
      );
    });
  });

  describe("formatParam function", () => {
    const builder = new StackBuilder({
      outputDir: "",
      outputFile: "",
      appName: {
        kebab: "",
        pascal: "",
      },
      imports: new Imports(),
      template: {} as StackTemplate,
    });

    test("formats noEcho values correctly", () => {
      expect(builder.formatParam("noEcho", true)).toBe(true);
    });

    test("formats allowedValues values correctly", () => {
      expect(builder.formatParam("allowedValues", ["one", "two"])).toBe(
        `["one", "two"]`
      );
    });

    test("formats other values correctly", () => {
      expect(builder.formatParam("key", "test")).toBe(`"test"`);
    });
  });

  describe("shouldSkipParamProp function", () => {
    const builder = new StackBuilder({
      outputDir: "",
      outputFile: "",
      appName: {
        kebab: "",
        pascal: "",
      },
      imports: new Imports(),
      template: {} as StackTemplate,
    });

    test("returns true if the key is one to skip", () => {
      expect(builder.shouldSkipParamProp("comment", "this is a comment")).toBe(
        true
      );
    });

    test("returns false if the key is not one to skip", () => {
      expect(
        builder.shouldSkipParamProp("description", "this is a description")
      ).toBe(false);
    });

    test("returns true if the type value is String", () => {
      expect(builder.shouldSkipParamProp("type", "String")).toBe(true);
    });

    test("returns false if the type value is not String", () => {
      expect(builder.shouldSkipParamProp("type", "Int")).toBe(false);
    });
  });
});
