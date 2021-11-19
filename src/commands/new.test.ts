import path from "path";
import { NewCommand } from "./new";

describe("The NewCommand class", () => {
  describe("getConfig function", () => {
    beforeAll(() => {
      NewCommand.validateConfig = jest.fn();
    });

    afterAll(() => {
      (NewCommand.validateConfig as unknown as jest.Mock).mockRestore();
    });

    const args = {
      "multi-app": false,
      init: false,
      app: "App",
      stack: "StackName",
    };

    const repoRoot = path.join(__dirname, "../..");

    test("pulls outs direct args correctly", async () => {
      expect(await NewCommand.getConfig(args)).toMatchObject({
        cdkDir: path.join(repoRoot, "cdk"),
        multiApp: false,
        appName: {
          pascal: "App",
          kebab: "app",
        },
        stackName: {
          pascal: "StackName",
          kebab: "stack-name",
        },
      });
    });

    test("pulls outs computed values correctly", async () => {
      expect(await NewCommand.getConfig(args)).toMatchObject({
        appPath: path.join(repoRoot, "cdk", "bin", "app.ts"),
        stackPath: path.join(repoRoot, "cdk", "lib", "app.ts"),
        testPath: path.join(repoRoot, "cdk", "lib", "app.test.ts"),
      });
    });

    test("pulls outs computed values correctly if multiApp is true", async () => {
      expect(
        await NewCommand.getConfig({
          "multi-app": true,
          init: false,
          app: "App",
          stack: "StackName",
        })
      ).toMatchObject({
        appPath: path.join(repoRoot, "cdk", "bin", "app.ts"),
        stackPath: path.join(repoRoot, "cdk", "lib", "app", "app.ts"),
        testPath: path.join(repoRoot, "cdk", "lib", "app", "app.test.ts"),
      });
    });
  });
});
