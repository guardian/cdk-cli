import { MockCodeMaker } from "../../test/utils/codemaker";
import type { CFNTemplate } from "./cfn";
import { Imports } from "./imports";
import { TestBuilder } from "./snapshot";

describe("The TestBuilder class", () => {
  describe("addTest function", () => {
    const builder = new TestBuilder({
      outputDir: "",
      stackName: "StackName",
      appName: "AppName",
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
        `describe("The StackName stack", () =>`
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
        `const stack = new StackName(app, "stack-name", { app: "app-name" });`
      );
      expect(codemaker._codemaker.line).toHaveBeenNthCalledWith(
        3,
        `expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();`
      );
      expect(codemaker._codemaker.closeBlock).toHaveBeenNthCalledWith(1, `});`);
      expect(codemaker._codemaker.closeBlock).toHaveBeenNthCalledWith(2, `});`);
    });
  });

  describe("constructSnapshotFile function", () => {
    const builder = new TestBuilder({
      outputDir: "",
      stackName: "StackName",
      appName: "AppName",
      template: {},
      imports: new Imports(),
    });
    const codemaker = new MockCodeMaker();
    builder.code = codemaker.codemaker;

    beforeEach(() => {
      codemaker.clear();
      builder.config.template = {};
    });

    test("adds snapshot boiler plate", () => {
      builder.constructSnapshotFile();
      expect(codemaker._codemaker.line).toHaveBeenNthCalledWith(
        1,
        "// Jest Snapshot v1, https://goo.gl/fbAQLP"
      );
      expect(codemaker._codemaker.line).toHaveBeenNthCalledWith(
        2,
        "exports[`The StackName matches the snapshot 1`] = `"
      );
      expect(codemaker._codemaker.line).toHaveBeenNthCalledWith(4, "`;");
    });

    test("adds correctly formatted template", () => {
      builder.config.template = {
        Parameters: {
          Parameter1: {
            Type: "String",
          },
        },
        Outputs: {
          Output1: {
            id: "Test",
          },
        },
      };

      builder.constructSnapshotFile();
      expect(codemaker._codemaker.line).toHaveBeenNthCalledWith(
        3,
        `Object {
  "Outputs": Object {
    "Output1": Object {
      "id": "Test",
    },
  },
  "Parameters": Object {
    "Parameter1": Object {
      "Type": "String",
    },
  },
}`
      );
    });

    test("only adds required keys", () => {
      builder.config.template = ({
        Test: "test",
      } as unknown) as CFNTemplate;

      builder.constructSnapshotFile();
      expect(codemaker._codemaker.line).toHaveBeenNthCalledWith(3, `Object {}`);
    });
  });
});
