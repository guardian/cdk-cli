import { parse, validate, Config } from "./args"

describe("The parse function", () => {
  const args = {
    args: {
      template: "template",
      output: "/path/to/output.ts",
      stack: "stack"
    }
  }

  test("pulls outs template, output and stack args", () => {
    expect(parse(args)).toMatchObject({
      cfnPath: "template",
      outputPath: "/path/to/output.ts",
      stackName: "stack",
    })
  })

  test("pulls outs output dir correctly", () => {
    expect(parse(args)).toMatchObject({
      outputDir: "/path/to",
    })
  })

  test("pulls outs output file correctly", () => {
    expect(parse(args)).toMatchObject({
      outputFile: "output.ts",
    })
  })
})

describe("The validate function", () => {
  test("does nothing if the file does exist", () => {
    expect(() => validate({cfnPath: "./README.md"} as Config)).not.toThrow()
  })

  test("throws an error if the file does not exist", () => {
    expect(() => validate({cfnPath: "./DONT-README.md"} as Config)).toThrow("File not found - ./DONT-README.md")
  })
})
