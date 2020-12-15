import type { CfnParameterProps } from "@aws-cdk/core";
import { CodeMaker, toCamelCase } from "codemaker";
import type { Imports } from "./imports";

interface CdkParameterProps extends CfnParameterProps {
  parameterType: string;
  comment?: string;
}

export interface CDKTemplate {
  Parameters: Record<string, CdkParameterProps>;
}

interface CDKBuilderProps {
  imports: Imports;
  template: CDKTemplate;
  stackName: string;
  outputFile: string;
  outputDir: string;
  comment?: string;
}

export class CdkBuilder {
  config;
  imports: Imports;
  template: CDKTemplate;

  code: CodeMaker;

  constructor({ imports, template, ...config }: CDKBuilderProps) {
    this.config = config;
    this.imports = imports;
    this.template = template;

    this.code = new CodeMaker({ indentationLevel: 2 });
    this.code.closeBlockFormatter = (s?: string): string => s ?? "}";
  }

  async constructCdkFile(): Promise<void> {
    this.code.openFile(this.config.outputFile);
    this.config.comment && this.code.line(this.config.comment);

    this.addImports();

    this.code.openBlock(
      `export class ${this.config.stackName} extends GuStack`
    );
    this.code.openBlock(
      `constructor(scope: App, id: string, props?: StackProps)`
    );
    this.code.line("super(scope, id, props);");

    this.addParams();

    this.code.closeBlock();
    this.code.closeBlock();

    this.code.closeFile(this.config.outputFile);
    await this.code.save(this.config.outputDir);
  }

  // TODO: Update this for our preferred style of imports
  addImports(): void {
    this.code.line();
    Object.keys(this.imports.imports)
      .sort()
      .forEach((lib) => {
        const imports = this.imports.imports[lib];

        imports.types.length &&
          this.code.line(
            `import type { ${imports.types.sort().join(", ")} } from "${lib}";`
          );

        imports.components.length &&
          this.code.line(
            `import { ${imports.components.sort().join(", ")} } from "${lib}";`
          );
      });
    this.code.line();
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

export const construct = async (props: CDKBuilderProps): Promise<void> => {
  const builder = new CdkBuilder(props);
  await builder.constructCdkFile();
};
