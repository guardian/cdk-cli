import { basename, dirname } from "path";
import { Command, flags } from "@oclif/command";
import { checkPathExists, getStackNameFromFileName } from "../utils/args";
import { construct } from "../utils/cdk";
import { parse } from "../utils/cfn";

interface MigrateCommandConfig {
  cfnPath: string;
  outputPath: string;
  outputDir: string;
  outputFile: string;
  stackName: string;
}

interface MigrateCommandArgs {
  template: string;
  output: string;
  stack?: string;
}

export class MigrateCommand extends Command {
  static description =
    "Migrates from a cloudformation template to Guardian flavoured CDK";

  static flags = {
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
  };

  static args = [
    {
      name: "template",
      required: true,
      description: "The template file to migrate",
    },
    {
      name: "output",
      required: true,
      description: "The file to output CDK to",
    },
    {
      name: "stack",
      required: false,
      description: "A name to give the stack. Defaults to match the filename.",
    },
  ];

  static getConfig = ({
    args,
  }: {
    args: MigrateCommandArgs;
  }): MigrateCommandConfig => {
    const outputFile = basename(args.output);

    const config = {
      cfnPath: args.template,
      outputPath: args.output,
      outputDir: dirname(args.output),
      outputFile: outputFile,
      stackName: args.stack ?? getStackNameFromFileName(outputFile),
    };

    checkPathExists(config.cfnPath);

    return config;
  };

  async run(): Promise<void> {
    this.log("Starting CDK generator");

    const config = MigrateCommand.getConfig(this.parse(MigrateCommand));

    this.log(`Converting template found at ${config.cfnPath}`);
    this.log(
      `New stack ${config.stackName} will be written to ${config.outputPath}`
    );

    const { imports, template } = parse(config);
    await construct(config, imports, template);
  }
}
