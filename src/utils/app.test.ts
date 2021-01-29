import { MockCodeMaker } from "../../test/utils/codemaker";
import { AppBuilder } from "./app";
import { Imports } from "./imports";

describe("The AppBuilder class", () => {
  describe("constructCdkFile function", () => {
    const codemaker = new MockCodeMaker();
    const args = {
      imports: new Imports(),
      appName: {
        pascal: "App",
        kebab: "app",
      },
      stacks: [{ name: { pascal: "Stack", kebab: "stack" } }],
      outputFile: "output",
      outputDir: "./cdk",
    };

    const builder = new AppBuilder(args);
    builder.code = codemaker.codemaker;

    beforeEach(() => {
      codemaker.clear();
      builder.config = args;
      builder.config.imports = new Imports();
    });

    test("renders the comment if provided", async () => {
      builder.config.comment = "This is a comment";
      await builder.constructCdkFile();

      expect(codemaker._codemaker.line).toHaveBeenNthCalledWith(
        1,
        "This is a comment"
      );
      expect(codemaker._codemaker.line).toHaveBeenNthCalledWith(2);
    });

    test("renders the imports", async () => {
      builder.config.imports.imports = {
        test: {
          components: ["Test"],
          types: [],
        },
      };
      await builder.constructCdkFile();

      expect(codemaker._codemaker.line).toHaveBeenCalledWith(
        `import { Test } from "test";`
      );
    });

    test("renders the app and stack definitions", async () => {
      await builder.constructCdkFile();

      expect(codemaker._codemaker.line).toHaveBeenCalledWith(
        `const app = new App();`
      );
      expect(codemaker._codemaker.line).toHaveBeenNthCalledWith(
        5,
        `new Stack(app, "Stack", { app: "app" });`
      );
    });
  });
});
