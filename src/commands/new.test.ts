import { NewCommand } from "./new";

describe("The NewCommand class", () => {
  describe("getConfig function", () => {
    const args = {
      args: {
        output: "/path/to/output.ts",
        stack: "stack",
      },
    };

    test("pulls out output and stack args", () => {
      expect(NewCommand.getConfig(args)).toMatchObject({
        outputPath: "/path/to/output.ts",
        stackName: "stack",
      });
    });

    test("pulls outs output dir correctly", () => {
      expect(NewCommand.getConfig(args)).toMatchObject({
        outputDir: "/path/to",
      });
    });

    test("pulls outs output file correctly", () => {
      expect(NewCommand.getConfig(args)).toMatchObject({
        outputFile: "output.ts",
      });
    });

    test("adds file extension to output file if not present", () => {
      expect(
        NewCommand.getConfig({
          args: { ...args.args, output: "/path/to/output" },
        })
      ).toMatchObject({
        outputFile: "output.ts",
      });
    });

    test("gets stack name from file if not provided", () => {
      const args = {
        args: {
          output: "/path/to/stack-name.ts",
        },
      };

      expect(NewCommand.getConfig({ ...args })).toMatchObject({
        stackName: "StackName",
      });
    });
  });
});
