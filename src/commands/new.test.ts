import { NewCommand } from "./new";

describe("The NewCommand class", () => {
  describe("getConfig function", () => {
    beforeAll(() => {
      NewCommand.validateConfig = jest.fn();
    });

    afterAll(() => {
      ((NewCommand.validateConfig as unknown) as jest.Mock).mockRestore();
    });

    const args = {
      args: {
        output: "/path/to/output",
        app: "App",
        stack: "StackName",
      },
      flags: {
        "multi-app": false,
      },
    };

    test("pulls outs direct args correctly", () => {
      expect(NewCommand.getConfig(args)).toMatchObject({
        cdkDir: "/path/to/output",
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

    test("pulls outs computed values correctly", () => {
      expect(NewCommand.getConfig(args)).toMatchObject({
        appPath: `/path/to/output/bin/app.ts`,
        stackPath: `/path/to/output/lib/stack-name.ts`,
        testPath: `/path/to/output/lib/stack-name.test.ts`,
      });
    });

    test("pulls outs computed values correctly if multiApp is true", () => {
      expect(
        NewCommand.getConfig({ ...args, flags: { "multi-app": true } })
      ).toMatchObject({
        appPath: `/path/to/output/bin/app.ts`,
        stackPath: `/path/to/output/lib/app/stack-name.ts`,
        testPath: `/path/to/output/lib/app/stack-name.test.ts`,
      });
    });
  });
});
