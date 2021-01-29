import type { CfnParameterProps } from "@aws-cdk/core";
import { CodeMaker, toCamelCase } from "codemaker";
import type { Imports } from "./imports";

interface CdkParameterProps extends CfnParameterProps {
  parameterType: string;
  comment?: string;
}

export interface StackTemplate {
  Parameters: Record<string, CdkParameterProps>;
}

interface StackBuilderProps {
  imports: Imports;
  template: StackTemplate;
  stackName: string;
  outputFile: string;
  outputDir: string;
  comment?: string;
}

export class StackBuilder {
  config: StackBuilderProps;
  imports: Imports;
  template: StackTemplate;

  code: CodeMaker;

  constructor(props: StackBuilderProps) {
    this.config = props;
    this.imports = props.imports;
    this.template = props.template;

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

    this.code.openBlock(
      `export class ${this.config.stackName} extends GuStack`
    );
    this.code.openBlock(
      `constructor(scope: App, id: string, props: GuStackProps)`
    );
    this.code.line("super(scope, id, props);");

    this.addParams();

    this.code.closeBlock();
    this.code.closeBlock();

    this.code.closeFile(this.config.outputFile);
    await this.code.save(this.config.outputDir);
  }

  addParams(): void {
    if (!Object.keys(this.template.Parameters).length) return;

    this.code.line();
    this.code.line("/* Parameters */");

    this.code.line(
      "// TODO: Consider if any of the parameter constructs from @guardian/cdk could be used here"
    );
    this.code.line(
      "// https://github.com/guardian/cdk/blob/main/src/constructs/core/parameters.ts"
    );
    this.code.openBlock(`const parameters =`);

    Object.keys(this.template.Parameters).forEach((paramName) => {
      this.addParam(paramName, this.template.Parameters[paramName]);
    });

    this.code.closeBlock("};");
  }

  addParam(name: string, props: CdkParameterProps): void {
    if (props.comment) {
      this.code.line(`// ${props.comment}`);
    }

    const propsToRender = Object.entries(props).filter(
      ([key, val]) => !this.shouldSkipParamProp(key, val)
    );

    if (!propsToRender.length) {
      this.code.line(
        `${name}: new ${props.parameterType}(this, "${name}", {}),`
      );
    } else {
      this.code.indent(
        `${name}: new ${props.parameterType}(this, "${name}", {`
      );

      propsToRender.forEach(([key, val]) => {
        const pKey = toCamelCase(key);

        this.code.line(
          [`${pKey}: `, this.formatParam(pKey, val), `,`].join("")
        );
      });

      this.code.unindent(`}),`);
    }
  }

  formatParam(name: string, value: unknown): unknown {
    switch (name) {
      case "noEcho":
        return value;
      case "allowedValues":
        return Array.isArray(value)
          ? `[${value.map((v: string) => `"${v}"`).join(", ")}]`
          : value;
      default:
        return typeof value === "string" ? `"${value}"` : value;
    }
  }

  shouldSkipParamProp(key: string, val: unknown): boolean {
    const keysToSkip = ["parameterType", "comment"];

    if (keysToSkip.includes(key)) return true;

    // Special cases

    if (key === "type" && val === "String") return true;

    return false;
  }
}

export const constructStack = async (
  props: StackBuilderProps
): Promise<void> => {
  const builder = new StackBuilder(props);
  await builder.constructCdkFile();
};
