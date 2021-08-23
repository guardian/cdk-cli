import { CodeMaker } from "codemaker";
import type { Imports } from "./imports";
import type { Name } from "./utils";

export interface StackProps {
  name: Name;
}

export interface AppTemplate {
  name: string;
  stacks: StackProps[];
}

interface AppBuilderProps {
  imports: Imports;
  appName: Name;
  stacks: StackProps[];
  outputFile: string;
  outputDir: string;
  comment?: string;
  migrated?: boolean;
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
      this.code.line(`//  TODO: Add stack name
//   e.g. { stack: "SomeStack" }`);
      this.code.line(
        `new ${stack.name.pascal}(app, "${stack.name.pascal}", {${
          this.config.migrated ? ", migratedFromCloudFormation: true" : ""
        } });`
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
