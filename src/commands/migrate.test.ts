import { MigrateCommand } from "./migrate";

describe("The MigrateCommand class", () => {
  describe("getConfig function", () => {
    beforeAll(() => {
      MigrateCommand.validateConfig = jest.fn();
    });

    afterAll(() => {
      ((MigrateCommand.validateConfig as unknown) as jest.Mock).mockRestore();
    });

    const args = {
      args: {
        template: "/path/to/template.ts",
        output: "/path/to/output",
        app: "App",
        stack: "StackName",
      },
      flags: {
        "multi-app": false,
      },
    };

    test("pulls outs direct args correctly", () => {
      expect(MigrateCommand.getConfig(args)).toMatchObject({
        cfnPath: "/path/to/template.ts",
        cdkDir: "/path/to/output",
        appName: {
          pascal: "App",
          kebab: "app",
        },
        stackName: {
          pascal: "StackName",
          kebab: "stack-name",
        },
        multiApp: false,
      });
    });

    test("pulls outs computed values correctly", () => {
      expect(MigrateCommand.getConfig(args)).toMatchObject({
        cfnFile: "template.ts",
        appPath: `/path/to/output/bin/app.ts`,
        stackPath: `/path/to/output/lib/stack-name.ts`,
        testPath: `/path/to/output/lib/stack-name.test.ts`,
      });
    });

    test("pulls outs computed values correctly if multiApp is true", () => {
      expect(
        MigrateCommand.getConfig({ ...args, flags: { "multi-app": true } })
      ).toMatchObject({
        cfnFile: "template.ts",
        appPath: `/path/to/output/bin/app.ts`,
        stackPath: `/path/to/output/lib/app/stack-name.ts`,
        testPath: `/path/to/output/lib/app/stack-name.test.ts`,
      });
    });

    test("gets stack name from file if not provided", () => {
      const args = {
        args: {
          template: "/path/to/template.ts",
          output: "/path/to",
          app: "app",
        },
        flags: {
          "multi-app": false,
        },
      };

      expect(MigrateCommand.getConfig(args)).toMatchObject({
        stackName: {
          pascal: "Template",
          kebab: "template",
        },
      });
    });
  });
});
