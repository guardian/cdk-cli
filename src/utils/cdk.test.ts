import type { CodeMaker } from "codemaker";
import type { Config } from "./args";
import type { CDKTemplate } from "./cdk";
import { CdkBuilder } from "./cdk";
import { Imports } from "./imports";

const mockedCodeMaker: Record<string, jest.Mock> = {
  line: jest.fn(),
  openBlock: jest.fn(),
  closeBlock: jest.fn(),
  indent: jest.fn(),
  unindent: jest.fn(),
};

const clearMockedCodeMaker = (): void => {
  Object.keys(mockedCodeMaker).forEach((key) =>
    mockedCodeMaker[key].mockClear()
  );
};

describe("The CdkBuilder class", () => {
  describe("addImport function", () => {
    const builder = new CdkBuilder(
      {} as Config,
      new Imports(),
      {} as CDKTemplate
    );
    builder.code = (mockedCodeMaker as unknown) as CodeMaker;

    beforeEach(clearMockedCodeMaker);

    afterEach(() => {
      builder.imports = new Imports();
    });

    test("adds a blank line at the start and end of the imports section", () => {
      builder.addImports();

      expect(mockedCodeMaker.line).toHaveBeenNthCalledWith(1);
      expect(mockedCodeMaker.line).toHaveBeenLastCalledWith();
    });

    test("always adds the @aws-cdk/core library first", () => {
      builder.addImports();
      expect(mockedCodeMaker.line).toHaveBeenNthCalledWith(
        2,
        `import { App, StackProps } from "@aws-cdk/core";`
      );
      expect(mockedCodeMaker.line).toHaveBeenNthCalledWith(
        3,
        `import { GuStack } from "@guardian/cdk/lib/constructs/core";`
      );
    });
    test("adds imports correctly", () => {
      const imports = new Imports();
      imports.imports = {
        test: ["Test"],
      };
      builder.imports = imports;

      builder.addImports();
      expect(mockedCodeMaker.line).toHaveBeenNthCalledWith(
        2,
        `import { Test } from "test";`
      );
    });
  });

  describe("addParams function", () => {
    const template: CDKTemplate = {
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
    const builder = new CdkBuilder({} as Config, new Imports(), template);
    builder.addParam = mockAddParam;
    builder.code = (mockedCodeMaker as unknown) as CodeMaker;

    beforeEach(() => {
      builder.template = template;
      clearMockedCodeMaker();
      mockAddParam.mockClear();
    });

    test("does not render anything if parameters are empty", () => {
      builder.template = {
        Parameters: {},
      };
      builder.addParams();

      expect(mockedCodeMaker.line).toHaveBeenCalledTimes(0);
    });

    test("adds parameters comments", () => {
      builder.addParams();

      expect(mockedCodeMaker.line).toHaveBeenNthCalledWith(1);
      expect(mockedCodeMaker.line).toHaveBeenNthCalledWith(
        2,
        "/* Parameters */"
      );
      expect(mockedCodeMaker.line).toHaveBeenNthCalledWith(
        3,
        "// TODO: Consider if any of the parameter constructs from @guardian/cdk could be used here"
      );
      expect(mockedCodeMaker.line).toHaveBeenNthCalledWith(
        4,
        "// https://github.com/guardian/cdk/blob/main/src/constructs/core/parameters.ts"
      );
    });

    test("creates parameters object", () => {
      builder.addParams();

      expect(mockedCodeMaker.openBlock).toHaveBeenNthCalledWith(
        1,
        "const parameters ="
      );
      expect(mockedCodeMaker.closeBlock).toHaveBeenNthCalledWith(1, "};");
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
    const builder = new CdkBuilder(
      {} as Config,
      new Imports(),
      {} as CDKTemplate
    );
    builder.code = (mockedCodeMaker as unknown) as CodeMaker;

    beforeEach(clearMockedCodeMaker);

    test("opens and closes the parameter correctly", () => {
      builder.addParam("test", { parameterType: "GuParameter" });
      expect(mockedCodeMaker.indent).toHaveBeenNthCalledWith(
        1,
        `test: new GuParameter(this, "test", {`
      );
      expect(mockedCodeMaker.unindent).toHaveBeenNthCalledWith(1, `}),`);
    });

    test("a comment is added if it exists", () => {
      builder.addParam("test", {
        comment: "This is a comment",
        parameterType: "GuParameter",
      });
      expect(mockedCodeMaker.line).toHaveBeenNthCalledWith(
        1,
        "// This is a comment"
      );
    });

    test("properties are added", () => {
      builder.addParam("test", {
        parameterType: "GuParameter",
        description: "test",
      });
      expect(mockedCodeMaker.line).toHaveBeenNthCalledWith(
        1,
        `description: "test",`
      );
      expect(mockedCodeMaker.line).toHaveBeenCalledTimes(1);
    });
  });

  describe("formatParam function", () => {
    const builder = new CdkBuilder(
      {} as Config,
      new Imports(),
      {} as CDKTemplate
    );

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
    const builder = new CdkBuilder(
      {} as Config,
      new Imports(),
      {} as CDKTemplate
    );

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
