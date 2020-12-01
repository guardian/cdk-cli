import fs from "fs";
import type { Config } from "./args";
import { getStackNameFromFileName, parse, validate } from "./args";

describe("The getStackNameFromFileName function", () => {
  test("strips file extension", () => {
    expect(getStackNameFromFileName("test.ts")).toBe("Test");
  });

  test("strips multiple extensions", () => {
    expect(getStackNameFromFileName("test.spec.ts")).toBe("Test");
  });

  test("converts snake case to pascal case", () => {
    expect(getStackNameFromFileName("test_name")).toBe("TestName");
  });

  test("converts kebab case to pascal case", () => {
    expect(getStackNameFromFileName("test-name")).toBe("TestName");
  });

  test("converts camel case to pascal case", () => {
    expect(getStackNameFromFileName("testName")).toBe("TestName");
  });

  test("converts mixed case to pascal case", () => {
    expect(getStackNameFromFileName("this-is_aTestName")).toBe(
      "ThisIsATestName"
    );
  });

  test("removes any other special characters", () => {
    expect(
      getStackNameFromFileName("t!e@s£t$-%n^a&m*e()_-+=[]{}|\\\"';:/?><,~`")
    ).toBe("TestName");
  });

  test("removes any spaces", () => {
    expect(getStackNameFromFileName("test name")).toBe("TestName");
  });

  test("allows numbers", () => {
    expect(getStackNameFromFileName("test name 1")).toBe("TestName1");
  });
});

describe("The parse function", () => {
  const args = {
    args: {
      template: "template",
      output: "/path/to/output.ts",
      stack: "stack",
    },
  };

  test("pulls outs template, output and stack args", () => {
    expect(parse(args)).toMatchObject({
      cfnPath: "template",
      outputPath: "/path/to/output.ts",
      stackName: "stack",
    });
  });

  test("pulls outs output dir correctly", () => {
    expect(parse(args)).toMatchObject({
      outputDir: "/path/to",
    });
  });

  test("pulls outs output file correctly", () => {
    expect(parse(args)).toMatchObject({
      outputFile: "output.ts",
    });
  });

  test("gets stack name from file if not provided", () => {
    const args = {
      args: {
        template: "template",
        output: "/path/to/stack-name.ts",
      },
    };

    expect(parse({ ...args })).toMatchObject({
      stackName: "StackName",
    });
  });
});

describe("The validate function", () => {
  const existsPath = "./I-DO-EXIST.md";
  const doesNotExistPath = "./I-DONT-EXIST.md";

  beforeAll(() => {
    if (!fs.existsSync(existsPath)) {
      fs.writeFileSync(existsPath, "test");
    }

    if (fs.existsSync(doesNotExistPath)) {
      throw new Error(
        `The file ${doesNotExistPath} should not exist as it will cause tests to fail. Either remove the file or change the "doesNotExistPath" value in "args.test.ts"`
      );
    }
  });

  afterAll(() => {
    if (fs.existsSync(existsPath)) {
      fs.unlinkSync(existsPath);
    }
  });

  test("does nothing if the file does exist", () => {
    expect(() => validate({ cfnPath: existsPath } as Config)).not.toThrow();
  });

  test("throws an error if the file does not exist", () => {
    expect(() => validate({ cfnPath: doesNotExistPath } as Config)).toThrow(
      "File not found - ./I-DONT-EXIST.md"
    );
  });
});
