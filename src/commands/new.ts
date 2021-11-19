import path, { basename, dirname } from "path";
import { Command, flags } from "@oclif/command";
import chalk from "chalk";
import cli from "cli-ux";
import kebabCase from "lodash.kebabcase";
import { constructApp } from "../utils/app";
import { checkPathDoesNotExist, checkPathExists } from "../utils/args";
import { execute } from "../utils/exec";
import {
  newAppImports,
  newStackImports,
  newTestImports,
} from "../utils/imports";
import { buildDirectory } from "../utils/init";
import { constructTest } from "../utils/snapshot";
import { constructStack } from "../utils/stack";
import type { Name } from "../utils/utils";
import { pascalCase } from "../utils/utils";

interface NewCommandConfig {
  cdkDir: string;
  multiApp: boolean;
  appPath: string;
  appName: Name;
  stackPath: string;
  stackName: Name;
  testPath: string;
  init: boolean;
  yamlTemplateLocation?: string;
}

interface NewCommandFlags {
  "multi-app": boolean;
  output: string;
  app: string;
  stack: string;
  init: boolean;
  "yaml-template-location"?: string;
}

export class NewCommand extends Command {
  static description = "Creates a new CDK stack";

  static flags = {
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
    "multi-app": flags.boolean({
      default: false,
      description:
        "Create the stack files within sub directories as the project defines multiple apps (defaults to false)",
    }),
    init: flags.boolean({
      default: true,
      description:
        "Create the cdk directory before building the app and stack files (defaults to true)",
    }),
    output: flags.string({
      required: false,
      default: path.join(__dirname, "cdk"),
      description: "The CDK directory to create the new files in",
    }),
    app: flags.string({
      required: true,
      description: "The name of your application e.g. Amigo",
    }),
    stack: flags.string({
      required: true,
      description:
        "The Guardian stack being used (as defined in your riff-raff.yaml). This will be applied as a tag to all of your resources.",
    }),
    "yaml-template-location": flags.string({
      required: false,
      description: "Path to the YAML CloudFormation template",
    }),
  };

  stackImports = newStackImports();

  static getConfig = ({
    flags,
  }: {
    flags: NewCommandFlags;
  }): NewCommandConfig => {
    const cdkDir = flags.output;
    const appName = pascalCase(flags.app);
    const kebabAppName = kebabCase(appName);
    const stackName = pascalCase(flags.stack);
    const kebabStackName = kebabCase(stackName);

    const config: NewCommandConfig = {
      cdkDir,
      multiApp: flags["multi-app"],
      appName: {
        kebab: kebabAppName,
        pascal: appName,
      },
      appPath: `${cdkDir}/bin/${kebabAppName}.ts`,
      stackName: {
        kebab: kebabStackName,
        pascal: stackName,
      },
      stackPath: `${cdkDir}/lib/${
        flags["multi-app"] ? `${kebabAppName}/` : ""
      }${kebabAppName}.ts`,
      testPath: `${cdkDir}/lib/${
        flags["multi-app"] ? `${kebabAppName}/` : ""
      }${kebabAppName}.test.ts`,
      init: flags["init"],
      yamlTemplateLocation: flags["yaml-template-location"],
    };

    NewCommand.validateConfig(config);

    return config;
  };

  static validateConfig = (config: NewCommandConfig): void => {
    if (!config.init) {
      checkPathExists(config.cdkDir);
    }
    checkPathDoesNotExist(config.appPath); // TODO: Update the app file if it already exists
    checkPathDoesNotExist(config.stackPath);

    if (config.yamlTemplateLocation) {
      checkPathExists(config.yamlTemplateLocation);
    }
  };

  async run(): Promise<void> {
    this.log("Starting CDK generator");

    const config = NewCommand.getConfig(this.parse(NewCommand));

    if (config.init) {
      buildDirectory({ outputDir: config.cdkDir }, this);
    }

    this.log(
      `New app ${config.appName.pascal} will be written to ${config.appPath}`
    );
    this.log(
      `New stack ${config.stackName.pascal} will be written to ${config.stackPath}`
    );

    // bin directory
    await constructApp({
      appName: config.appName,
      outputFile: "cdk.ts",
      outputDir: dirname(config.appPath),
      stack: config.stackName,
      imports: newAppImports(config.appName, config.multiApp),
    });

    // lib directory
    await constructStack({
      imports: this.stackImports,
      appName: config.appName,
      outputFile: basename(config.stackPath),
      outputDir: dirname(config.stackPath),
      yamlTemplateLocation: config.yamlTemplateLocation,
    });

    // lib directory
    await constructTest({
      imports: newTestImports(config.appName),
      stackName: config.stackName,
      appName: config.appName,
      outputFile: basename(config.testPath),
      outputDir: dirname(config.stackPath),
    });

    if (config.init) {
      cli.action.start(
        chalk.yellow("Installing dependencies. This may take a while...")
      );
      await execute("./script/setup", [], { cwd: config.cdkDir });
      cli.action.stop();
    }

    // Run `eslint --fix` on the generated files instead of trying to generate code that completely satisfies the linter
    await execute(
      "./node_modules/.bin/eslint",
      [
        "lib/** bin/**",
        "--ext .ts",
        "--no-error-on-unmatched-pattern",
        "--fix",
      ],
      {
        cwd: config.cdkDir,
      }
    );

    cli.action.start(chalk.yellow("Running tests..."));
    await execute("./script/test", [], { cwd: config.cdkDir });
    cli.action.stop();

    this.log(chalk.green("Summarising the created files"));
    const tree = await execute("tree", ["-I 'node_modules|cdk.out'"], {
      cwd: config.cdkDir,
    });
    this.log(tree);
  }
}
