import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
} from "fs";
import { join } from "path";
import { Command, flags } from "@oclif/command";
import { checkDirectoryIsEmpty } from "../utils/args";

interface InitCommandConfig {
  outputDir: string;
}

interface InitCommandArgs {
  output: string;
}

// TODO: Add yarn or npm flag
// TODO: Add project name flag
export class InitCommand extends Command {
  static description =
    "Creates a new directory containing boilerplate configuration";

  static flags = {
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
  };

  static args = [
    {
      name: "output",
      required: false,
      default: "./cdk",
      description: "The path of the new directory to create. Defaults to ./cdk",
    },
  ];

  static getConfig = ({
    args,
  }: {
    args: InitCommandArgs;
  }): InitCommandConfig => {
    const config = {
      outputDir: args.output,
    };

    InitCommand.validateConfig(config);

    return config;
  };

  static validateConfig = (config: InitCommandConfig): void => {
    checkDirectoryIsEmpty(config.outputDir);
  };

  templateDir = `${__dirname}/../template`;

  // eslint-disable-next-line @typescript-eslint/require-await -- The Command class requires Promise<any> but we don't do anything async here
  async run(): Promise<void> {
    this.log("Starting CDK generator");

    const config = InitCommand.getConfig(this.parse(InitCommand));

    if (!existsSync(config.outputDir)) {
      this.log(`Creating ${config.outputDir}`);
      mkdirSync(config.outputDir);
    }

    this.log("Copying template files");
    // TODO: Replace any params in files with .template extensions
    this.copyFiles(this.templateDir, config.outputDir);

    this.log("Success!");
    // TODO: Can we do this here?
    this.log("Run ./script/setup to get started");
    this.log(
      "To migrate existing stacks into your new directory you can run cdk-cli migrate"
    );
    this.log("To create a new stack run cdk-cli new");
  }

  copyFiles(sourcePath: string, targetPath: string): void {
    for (const file of readdirSync(sourcePath)) {
      const path = join(sourcePath, file);

      if (path.endsWith(".ignore")) {
        continue;
      } else if (lstatSync(path).isDirectory()) {
        const nestedTargetPath = join(targetPath, file);
        if (!existsSync(nestedTargetPath)) {
          mkdirSync(nestedTargetPath);
        }
        this.copyFiles(path, nestedTargetPath);
      } else if (path.endsWith(".template")) {
        copyFileSync(path, join(targetPath, file.replace(".template", "")));
      } else {
        copyFileSync(path, join(targetPath, file));
      }
    }
  }
}
