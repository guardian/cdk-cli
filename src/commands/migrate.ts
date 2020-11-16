import { Command, flags } from '@oclif/command';
import * as args from '../utils/args';
import { construct } from '../utils/cdk';
import { parse } from '../utils/cfn';

export default class CdkMigrator extends Command {
  static description =
    'Migrates from a cloudformation template to Guardian flavoured CDK';

  static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
  };

  static args = [
    {
      name: 'template',
      required: true,
      description: 'The template file to migrate',
    },
    {
      name: 'output',
      required: true,
      description: 'The file to output CDK to',
    },
    {
      // TODO: Use the output filename if this isn't provided
      name: 'stack',
      required: true,
      description: 'The name to give the stack',
    },
  ];

  async run(): Promise<void> {
    this.log('Starting CDK generator');

    const config = args.parse(this.parse(CdkMigrator));
    args.validate(config);

    this.log(`Converting template found at ${config.cfnPath}`);
    this.log(
      `New stack ${config.stackName} will be written to ${config.outputPath}`
    );

    const { imports, template } = parse(config);
    construct(config, imports, template);
  }
}
