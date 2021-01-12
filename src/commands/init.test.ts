import { InitCommand } from "./init";

describe("The InitCommand class", () => {
  describe("getConfig function", () => {
    const args = {
      args: {
        output: "./cdk",
      },
    };

    test("pulls outs output dir correctly", () => {
      expect(InitCommand.getConfig(args)).toMatchObject({
        outputDir: "./cdk",
      });
    });
  });
});
