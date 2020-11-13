import * as path from 'path';
import * as fs from 'fs';

export interface Config {
  cfn_path: string;
  output_path: string;
  output_dir: string;
  output_file: string;
  stack_name: string;
}

export const parse = ({ args }: { args: { [name: string]: any } }): Config => {
  return {
    cfn_path: args.template,
    output_path: args.output,
    output_dir: path.dirname(args.output),
    output_file: path.basename(args.output),
    stack_name: args.stack,
  };
};

export const validate = (config: Config): void => {
  if (!fs.existsSync(config.cfn_path)) {
    throw new Error(`File not found - ${config.cfn_path}`);
  }
};
