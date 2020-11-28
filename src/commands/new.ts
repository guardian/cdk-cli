import { Command, flags } from '@oclif/command';
import { getStackNameFromFileName } from '../utils/args';
import { construct } from '../utils/cdk';
import { basename, dirname } from 'path';
import { Imports } from '../utils/imports';

interface NewCommandConfig {
  outputPath: string;
  outputDir: string;
  outputFile: string;
  stackName: string;
}

export default class NewCommand extends Command {
  static description = 'Creates a new CDK stack';

  static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
  };

  static args = [
    {
      name: 'output',
      required: true,
      description: 'The file to output CDK to',
    },
    {
      name: 'stack',
      required: false,
      description: 'A name to give the stack. Defaults to match the filename.',
    },
  ];

  static getConfig = ({
    args,
  }: {
    args: { [name: string]: any };
  }): NewCommandConfig => {
    const outputFile = basename(args.output);

    return {
      outputPath: args.output,
      outputDir: dirname(args.output),
      outputFile: outputFile,
      stackName: args.stack ?? getStackNameFromFileName(outputFile),
    };
  };

  async run(): Promise<void> {
    this.log('Starting CDK generator');

    const config = NewCommand.getConfig(this.parse(NewCommand));

    this.log(
      `New stack ${config.stackName} will be written to ${config.outputPath}`
    );

    const imports = new Imports();
    const template = {
      Parameters: {},
    };

    construct({
      imports,
      template,
      ...config,
      comment: '// This file was autogenerated using @guardian/cdk-cli',
    });
  }
}
