import { InitCommand } from "./init";

describe("The NewCommand class", () => {
  describe("getConfig function", () => {
    const args = {
      args: {
        output: "./test",
      },
    };

    test("pulls outs output dir correctly", () => {
      expect(InitCommand.getConfig(args)).toMatchObject({
        outputDir: "./test",
      });
    });
  });
});
