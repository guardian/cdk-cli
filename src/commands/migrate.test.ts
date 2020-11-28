import { existsSync, unlinkSync, writeFileSync } from "fs";
import { MigrateCommand } from "./migrate";

describe("The MigrateCommand class", () => {
  describe("getConfig function", () => {
    const existsPath = "./EXISTS-MIGRATE.md";
    beforeAll(() => {
      if (!existsSync(existsPath)) {
        writeFileSync(existsPath, "test");
      }
    });

    afterAll(() => {
      if (existsSync(existsPath)) {
        unlinkSync(existsPath);
      }
    });

    const args = {
      args: {
        template: existsPath,
        output: "/path/to/output.ts",
        stack: "stack",
      },
    };

    test("pulls outs template, output and stack args", () => {
      expect(MigrateCommand.getConfig(args)).toMatchObject({
        cfnPath: existsPath,
        outputPath: "/path/to/output.ts",
        stackName: "stack",
      });
    });

    test("pulls outs output dir correctly", () => {
      expect(MigrateCommand.getConfig(args)).toMatchObject({
        outputDir: "/path/to",
      });
    });

    test("pulls outs output file correctly", () => {
      expect(MigrateCommand.getConfig(args)).toMatchObject({
        outputFile: "output.ts",
      });
    });

    test("gets stack name from file if not provided", () => {
      const args = {
        args: {
          template: existsPath,
          output: "/path/to/stack-name.ts",
        },
      };

      expect(MigrateCommand.getConfig({ ...args })).toMatchObject({
        stackName: "StackName",
      });
    });
  });
});
