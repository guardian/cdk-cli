import fs from "fs";
import yaml from "js-yaml";
import { mocked } from "ts-jest/utils";
import type { Config } from "./args";
import { CfnParser } from "./cfn";
import { Imports } from "./imports";

jest.mock("fs");
const mockedFs = mocked(fs, true);

jest.mock("js-yaml");
const mockedYaml = mocked(yaml, true);

describe("The CfnParser class", () => {
  describe("parse function", () => {
    const mockParseParameters = jest.fn();
    const parser = new CfnParser({ cfnPath: "test" } as Config);
    parser.parseParameters = mockParseParameters;

    beforeEach(() => {
      mockedFs.readFileSync.mockClear();
      mockedYaml.safeLoad.mockClear();
      mockParseParameters.mockClear();
    });

    test("tries to read the template file from disk", () => {
      parser.parse();
      expect(mockedFs.readFileSync).toHaveBeenCalledWith("test", "utf8");
    });

    test("tries to parse the yaml", () => {
      parser.parse();
      expect(mockedYaml.safeLoad).toHaveBeenCalled();
    });

    test("calls parseParameters", () => {
      parser.parse();
      expect(mockParseParameters).toHaveBeenCalled();
    });

    test("throws an error if something goes wrong", () => {
      mockParseParameters.mockImplementation(() => {
        throw new Error();
      });

      expect(parser.parse).toThrowError("Failed to parse template file - ");
    });
  });

  describe("parseParameter function", () => {
    const parser = new CfnParser({} as Config);

    beforeEach(() => {
      parser.template = {
        Parameters: {},
      };

      parser.imports = new Imports();
      parser.imports.imports = {};
    });

    test("adds a GuStringParameter and imports for string parameters", () => {
      const cfn = {
        Parameters: {
          test: {
            Type: "String",
            Description: "This is a test",
          },
        },
      };
      parser.parseParameters(cfn);

      expect(parser.template.Parameters).toMatchObject({
        test: {
          parameterType: "GuStringParameter",
          description: "This is a test",
        },
      });

      expect(parser.imports.imports).toMatchObject({
        "@guardian/cdk/lib/constructs/core": {
          components: ["GuStringParameter"],
          types: [],
        },
      });
    });

    test("adds a GuParameter and imports for non string parameters", () => {
      const cfn = {
        Parameters: {
          test: {
            Type: "Int",
            Description: "This is a test",
          },
        },
      };
      parser.parseParameters(cfn);

      expect(parser.template.Parameters).toMatchObject({
        test: {
          parameterType: "GuParameter",
          type: "Int",
          description: "This is a test",
        },
      });

      expect(parser.imports.imports).toMatchObject({
        "@guardian/cdk/lib/constructs/core": {
          components: ["GuParameter"],
          types: [],
        },
      });
    });

    test("attaches a comment if there is a similar construct", () => {
      const cfn = {
        Parameters: {
          stage: {
            Type: "Int",
            Description: "This is a test",
          },
        },
      };
      parser.parseParameters(cfn);

      expect(parser.template.Parameters.stage.comment).toBe(
        "Your parameter looks similar to GuStageParameter. Consider using that instead."
      );
    });

    test("writes all param props in camel case", () => {
      const cfn = {
        Parameters: {
          test: {
            Type: "Int",
            Description: "This is a test",
            AllowedPattern: "/test/",
            ConstraintDescription: "constraint description",
          },
        },
      };
      parser.parseParameters(cfn);

      expect(parser.template.Parameters.test).toMatchObject({
        type: "Int",
        description: "This is a test",
        allowedPattern: "/test/",
        constraintDescription: "constraint description",
      });
    });
  });

  describe("getSimilarConstructs function", () => {
    const parser = new CfnParser({} as Config);
    const expectedComment = `Your parameter looks similar to GuStageParameter. Consider using that instead.`;

    test("returns the correct comment when name is stage", () => {
      expect(parser.getSimilarConstructs("stage")).toBe(expectedComment);
    });

    test("returns the correct comment when name is stageparameter", () => {
      expect(parser.getSimilarConstructs("stageparameter")).toBe(
        expectedComment
      );
    });

    test("matches for TitleCase", () => {
      expect(parser.getSimilarConstructs("StageParameter")).toBe(
        expectedComment
      );
    });

    test("matches for camelCase", () => {
      expect(parser.getSimilarConstructs("stageParameter")).toBe(
        expectedComment
      );
    });

    test("matches for snake-case", () => {
      expect(parser.getSimilarConstructs("stage_parameter")).toBe(
        expectedComment
      );
    });

    test("matches for kebab-case", () => {
      expect(parser.getSimilarConstructs("stage-parameter")).toBe(
        expectedComment
      );
    });
  });
});
