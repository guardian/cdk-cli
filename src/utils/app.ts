import { CodeMaker } from "codemaker";
import kebabCase from "lodash.kebabcase";
import type { Imports } from "./imports";

export interface StackProps {
  name: string;
}

export interface AppTemplate {
  name: string;
  stacks: StackProps[];
}

interface AppBuilderProps {
  imports: Imports;
  appName: string;
  stacks: StackProps[];
  outputFile: string;
  outputDir: string;
  comment?: string;
}

export class AppBuilder {
  config: AppBuilderProps;

  code: CodeMaker;

  constructor(props: AppBuilderProps) {
    this.config = props;

    this.code = new CodeMaker({ indentationLevel: 2 });
    this.code.closeBlockFormatter = (s?: string): string => s ?? "}";
  }

  async constructCdkFile(): Promise<void> {
    this.code.openFile(this.config.outputFile);
    if (this.config.comment) {
      this.code.line(this.config.comment);
      this.code.line();
    }

    this.config.imports.render(this.code);

    this.code.line("const app = new App();");

    this.config.stacks.forEach((stack) => {
      this.code.line(
        `new ${stack.name}(app, "${stack.name}", { app: "${kebabCase(
          this.config.appName
        )}" });`
      );
    });

    this.code.closeFile(this.config.outputFile);
    await this.code.save(this.config.outputDir);
  }
}

export const constructApp = async (props: AppBuilderProps): Promise<void> => {
  const builder = new AppBuilder(props);
  await builder.constructCdkFile();
};