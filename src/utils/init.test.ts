import { ProjectBuilder } from "./init";

describe("The ProjectBuilder class", () => {
  describe("validateConfig function", () => {
    test("throws an error if the directory is not empty", () => {
      expect(() =>
        ProjectBuilder.validateConfig({ outputDir: "./src" })
      ).toThrow();
    });

    test("does not throw an error if the directory is empty", () => {
      expect(() =>
        ProjectBuilder.validateConfig({ outputDir: "./src/empty" })
      ).not.toThrow();
    });
  });
});
