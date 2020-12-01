import { existsSync } from "fs";
import { basename, dirname } from "path";
import { toPascalCase } from "codemaker";

export interface Config {
  cfnPath: string;
  outputPath: string;
  outputDir: string;
  outputFile: string;
  stackName: string;
}

export const getStackNameFromFileName = (filename: string): string => {
  // Split on . and get first element to remove any extensions
  // Replace anything which is a space, word char, underscore or hyphen
  // Convert to PascalCase
  // Remove any remaining special chars
  return toPascalCase(
    filename.split(".")[0].replace(/[^\w\s_-]/gi, "")
  ).replace(/[^\w]/gi, "");
};

interface Args {
  template: string;
  output: string;
  stack?: string;
}

export const parse = ({ args }: { args: Args }): Config => {
  const outputFile = basename(args.output);

  return {
    cfnPath: args.template,
    outputPath: args.output,
    outputDir: dirname(args.output),
    outputFile: outputFile,
    stackName: args.stack ?? getStackNameFromFileName(outputFile),
  };
};

export const validate = (config: Config): void => {
  if (!existsSync(config.cfnPath)) {
    throw new Error(`File not found - ${config.cfnPath}`);
  }
};
