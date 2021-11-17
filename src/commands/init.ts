import { Command, flags } from "@oclif/command";
import { buildDirectory } from "../utils/init";

// TODO: Add yarn or npm flag
// TODO: Add project name flag
export class InitCommand extends Command {
  static description =
    "Creates a new directory containing boilerplate configuration";

  static flags = {
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
    output: flags.string({
      required: true,
      description: "The path of the new directory to create.",
    }),
  };

  // eslint-disable-next-line @typescript-eslint/require-await -- The Command class requires Promise<any> but we don't do anything async here
  async run(): Promise<void> {
    this.log("Starting CDK generator");

    const { flags } = this.parse(InitCommand);

    buildDirectory({ outputDir: flags.output }, this);

    this.log(
      "To migrate existing stacks into your new directory you can run cdk-cli migrate"
    );
    this.log("To create a new stack run cdk-cli new");
  }
}
