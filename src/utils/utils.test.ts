import { camelCaseObjectKeys } from "./utils";

describe("The camelCaseObjectKeys function", () => {
  test("converts keys from kebab-case", () => {
    expect(camelCaseObjectKeys({ "kebab-case": { name: "test" } })).toEqual({
      kebabCase: { name: "test" },
    });
  });

  test("converts keys from snake_case", () => {
    expect(camelCaseObjectKeys({ snake_case: { name: "test" } })).toEqual({
      snakeCase: { name: "test" },
    });
  });

  test("converts keys from TitleCase", () => {
    expect(camelCaseObjectKeys({ TitleCase: { name: "test" } })).toEqual({
      titleCase: { name: "test" },
    });
  });

  test("converts all keys", () => {
    expect(
      camelCaseObjectKeys({
        TitleCase: { name: "title" },
        snake_case: { name: "snake" },
        "kebab-case": { name: "kebab" },
      })
    ).toEqual({
      titleCase: { name: "title" },
      snakeCase: { name: "snake" },
      kebabCase: { name: "kebab" },
    });
  });

  test("doesn't fail for an empty object", () => {
    expect(camelCaseObjectKeys({})).toEqual({});
  });
});
