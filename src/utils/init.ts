import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
} from "fs";
import { join } from "path";
import type Command from "@oclif/command";
import { checkDirectoryIsEmpty } from "../utils/args";

export interface InitConfig {
  outputDir: string;
}

// TODO: Add yarn or npm flag
// TODO: Add project name flag
export class ProjectBuilder {
  templateDir = `${__dirname}/../template`;
  config: InitConfig;
  command: Command;

  static validateConfig = (config: InitConfig): void => {
    checkDirectoryIsEmpty(config.outputDir);
  };

  constructor(config: InitConfig, command: Command) {
    this.config = config;
    this.command = command;
  }

  buildDirectory(): void {
    ProjectBuilder.validateConfig(this.config);

    if (!existsSync(this.config.outputDir)) {
      this.command.log(`Creating ${this.config.outputDir}`);
      mkdirSync(this.config.outputDir);
    }

    this.command.log("Copying template files");
    // TODO: Replace any params in files with .template extensions
    this.copyFiles(this.templateDir, this.config.outputDir);

    this.command.log("Success!");
    // TODO: Can we do this here?
    this.command.log("Run ./script/setup to install dependencies");
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

export const buildDirectory = (config: InitConfig, command: Command): void => {
  const builder = new ProjectBuilder(config, command);
  builder.buildDirectory();
};
