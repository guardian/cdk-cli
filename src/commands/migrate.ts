import { Command, flags } from "@oclif/command";
import { parse as argparse, validate } from "../utils/args";
import { construct } from "../utils/cdk";
import { parse } from "../utils/cfn";

export class CdkMigrator extends Command {
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

  async run(): Promise<void> {
    this.log("Starting CDK generator");

    const config = argparse(this.parse(CdkMigrator));
    validate(config);

    this.log(`Converting template found at ${config.cfnPath}`);
    this.log(
      `New stack ${config.stackName} will be written to ${config.outputPath}`
    );

    const { imports, template } = parse(config);
    await construct(config, imports, template);
  }
}
