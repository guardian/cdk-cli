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
      flags: {
        "multi-app": false,
        init: false,
        output: "/path/to/output",
        app: "App",
        stack: "StackName",
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
        stackPath: `/path/to/output/lib/app.ts`,
        testPath: `/path/to/output/lib/app.test.ts`,
      });
    });

    test("pulls outs computed values correctly if multiApp is true", () => {
      expect(
        NewCommand.getConfig({
          flags: {
            "multi-app": true,
            init: false,
            output: "/path/to/output",
            app: "App",
            stack: "StackName",
          },
        })
      ).toMatchObject({
        appPath: `/path/to/output/bin/app.ts`,
        stackPath: `/path/to/output/lib/app/app.ts`,
        testPath: `/path/to/output/lib/app/app.test.ts`,
      });
    });
  });
});
