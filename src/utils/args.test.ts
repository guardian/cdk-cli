import {
  existsSync,
  mkdirSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from "fs";
import { join } from "path";
import {
  checkDirectoryIsEmpty,
  checkPathDoesNotExist,
  checkPathExists,
  getStackNameFromFileName,
} from "./args";

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

describe("The checkPathDoesNotExist function", () => {
  const existsPath = "./EXISTS-ARGS2.md";
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

  test("does nothing if the file does not exist", () => {
    expect(() => checkPathDoesNotExist(doesNotExistPath)).not.toThrow();
  });

  test("throws an error if the file does exist", () => {
    expect(() => checkPathDoesNotExist(existsPath)).toThrow(
      "There is already a file at - ./EXISTS-ARGS2.md"
    );
  });
});

describe("The checkDirectoryIsEmpty function", () => {
  let alreadyExists = false;
  const emptyBase = "./EXISTS-DIR";
  const emptyPath = join(emptyBase, "/empty");
  const notEmptyPath = join(emptyBase, "/not-empty");
  const notEmptyFile = join(notEmptyPath, "test.md");

  beforeAll(() => {
    if (existsSync(emptyBase)) {
      alreadyExists = true;
      throw new Error(
        `The ${emptyBase} directory already exists. Please remove or change the emptyBase var before continuing.`
      );
    }

    [emptyBase, emptyPath, notEmptyPath].forEach((path) => {
      if (!existsSync(path)) {
        mkdirSync(path);
      }
    });

    if (!existsSync(notEmptyFile)) {
      writeFileSync(notEmptyFile, "test");
    }
  });

  afterAll(() => {
    if (!alreadyExists && existsSync(emptyBase)) {
      rmdirSync(emptyBase, { recursive: true });
    }
  });

  test("does nothing if the directory is empty", () => {
    expect(() => checkDirectoryIsEmpty(emptyPath)).not.toThrow();
  });

  test("throws an error if the directory is not empty", () => {
    expect(() => checkDirectoryIsEmpty(notEmptyPath)).toThrow(
      "Directory EXISTS-DIR/not-empty is not empty"
    );
  });
});
