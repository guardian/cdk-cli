import * as path from 'path';
import * as fs from 'fs';

export interface Config {
  cfnPath: string;
  outputPath: string;
  outputDir: string;
  outputFile: string;
  stackName: string;
}

export const parse = ({ args }: { args: { [name: string]: any } }): Config => {
  return {
    cfnPath: args.template,
    outputPath: args.output,
    outputDir: path.dirname(args.output),
    outputFile: path.basename(args.output),
    stackName: args.stack,
  };
};

export const validate = (config: Config): void => {
  if (!fs.existsSync(config.cfnPath)) {
    throw new Error(`File not found - ${config.cfnPath}`);
  }
};
