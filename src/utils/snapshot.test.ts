import { MockCodeMaker } from "./codemaker";
import { Imports } from "./imports";
import { TestBuilder } from "./snapshot";

describe("The TestBuilder class", () => {
  describe("addTest function", () => {
    const builder = new TestBuilder({
      outputDir: "",
      outputFile: "",
      stackName: {
        pascal: "StackName",
        kebab: "stack-name",
      },
      appName: {
        pascal: "AppName",
        kebab: "app-name",
      },
      imports: new Imports(),
    });
    const codemaker = new MockCodeMaker();
    builder.code = codemaker.codemaker;

    beforeEach(() => {
      codemaker.clear();
    });

    test("adds a snapshot test", () => {
      builder.addTest();
      expect(codemaker._codemaker.openBlock).toHaveBeenNthCalledWith(
        1,
        `describe("The AppName stack", () =>`
      );
      expect(codemaker._codemaker.openBlock).toHaveBeenNthCalledWith(
        2,
        `it("matches the snapshot", () =>`
      );
      expect(codemaker._codemaker.line).toHaveBeenNthCalledWith(
        1,
        `const app = new App();`
      );
      expect(codemaker._codemaker.line).toHaveBeenNthCalledWith(
        2,
        `const stack = new AppName(app, "AppName", { stack: "stack-name" });`
      );
      expect(codemaker._codemaker.line).toHaveBeenNthCalledWith(
        3,
        `expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();`
      );
      expect(codemaker._codemaker.closeBlock).toHaveBeenNthCalledWith(1, `});`);
      expect(codemaker._codemaker.closeBlock).toHaveBeenNthCalledWith(2, `});`);
    });
  });
});
