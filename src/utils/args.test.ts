import { existsSync, unlinkSync, writeFileSync } from "fs";
import { checkPathExists, getStackNameFromFileName } from "./args";

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

describe("The checkPathExists function", () => {
  const existsPath = "./EXISTS-ARGS.md";
  const doesNotExistPath = "./I-DONT-EXIST.md";

  beforeAll(() => {
    if (!existsSync(existsPath)) {
      writeFileSync(existsPath, "test");
    }

    if (existsSync(doesNotExistPath)) {
      throw new Error(
        `The file ${doesNotExistPath} should not exist as it will cause tests to fail. Either remove the file or change the "doesNotExistPath" value in "args.test.ts"`
      );
    }
  });

  afterAll(() => {
    if (existsSync(existsPath)) {
      unlinkSync(existsPath);
    }
  });

  test("does nothing if the file does exist", () => {
    expect(() => checkPathExists(existsPath)).not.toThrow();
  });

  test("throws an error if the file does not exist", () => {
    expect(() => checkPathExists(doesNotExistPath)).toThrow(
      "File not found - ./I-DONT-EXIST.md"
    );
  });
});
