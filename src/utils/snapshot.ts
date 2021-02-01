import { CodeMaker } from "codemaker";
import kebabCase from "lodash.kebabcase";
import prettyFormat from "pretty-format";
import type { CFNTemplate } from "./cfn";
import type { Imports } from "./imports";

export interface TestBuilderProps {
  imports: Imports;
  appName: string;
  stackName: string;
  outputDir: string;
  template?: CFNTemplate;
  comment?: string;
}

const snapshotKeys = ["Outputs", "Resources", "Mappings", "Parameters"];

export class TestBuilder {
  config: TestBuilderProps;
  imports: Imports;
  testFile: string;
  snapshotFile: string;

  code: CodeMaker;

  constructor(props: TestBuilderProps) {
    this.config = props;
    this.imports = props.imports;

    this.code = new CodeMaker({ indentationLevel: 2 });
    this.code.closeBlockFormatter = (s?: string): string => s ?? "}";

    this.testFile = `${kebabCase(this.config.stackName)}.test.ts`;
    this.snapshotFile = `__snapshots__/${kebabCase(
      this.config.stackName
    )}.test.ts.snap`;
  }

  async writeTestFiles(): Promise<void> {
    this.constructTestFile();
    if (this.config.template) {
      this.constructSnapshotFile();
    }
    await this.code.save(this.config.outputDir);
  }

  constructTestFile(): void {
    this.code.openFile(this.testFile);
    if (this.config.comment) {
      this.code.line(this.config.comment);
      this.code.line();
    }

    this.config.imports.render(this.code);

    this.addTest();

    this.code.closeFile(this.testFile);
  }

  constructSnapshotFile(): void {
    this.code.openFile(this.snapshotFile);

    this.code.line("// Jest Snapshot v1, https://goo.gl/fbAQLP");

    this.code.line(
      `exports[\`The ${this.config.stackName} matches the snapshot 1\`] = \``
    );

    const objTemplate = (this.config.template as unknown) as Record<
      string,
      unknown
    >;
    const filteredTemplate: Record<string, unknown> = {};
    Object.keys(objTemplate)
      .filter((key) => snapshotKeys.includes(key))
      .map((key) => {
        filteredTemplate[key] = objTemplate[key];
      });

    this.code.line(prettyFormat(filteredTemplate));

    this.code.line(`\`;`);

    this.code.closeFile(this.snapshotFile);
  }

  addTest(): void {
    this.code.openBlock(`describe("The ${this.config.stackName} stack", () =>`);
    this.code.openBlock(`it("matches the snapshot", () =>`);

    this.code.line("const app = new App();");
    this.code.line(
      `const stack = new ${this.config.stackName}(app, "${kebabCase(
        this.config.stackName
      )}", { app: "${kebabCase(this.config.appName)}" });`
    );
    this.code.line(
      "expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();"
    );

    this.code.closeBlock("});");
    this.code.closeBlock("});");
  }
}

export const constructTest = async (props: TestBuilderProps): Promise<void> => {
  const builder = new TestBuilder(props);
  await builder.writeTestFiles();
};
