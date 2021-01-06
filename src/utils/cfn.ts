import { readFileSync } from "fs";
import { toCamelCase } from "codemaker";
import { DEFAULT_SCHEMA, load, Type } from "js-yaml";
import type { CDKTemplate } from "./cdk";
import { Imports } from "./imports";
import { camelCaseObjectKeys } from "./utils";

export interface CFNTemplate {
  Parameters: Record<string, Record<string, unknown>>;
}

// TODO: Allow for all CDK tags
const CDK_SCHEMA = DEFAULT_SCHEMA.extend([
  new Type("!Ref", {
    kind: "scalar",
    construct: (data: string) => ({ Ref: data }),
  }),
  new Type("!Sub", {
    kind: "scalar",
    construct: (data: string) => ({ "Fn::Sub": data }),
  }),
  new Type("!GetAZs", {
    kind: "scalar",
    construct: (data: unknown) => ({ "Fn::GetAZs": data }),
  }),
]);

export class CfnParser {
  cfnPath: string;

  // TODO: Make this its own class so that we can do addParameter?
  //       Then the builder would be part of that?
  template: CDKTemplate = {
    Parameters: {},
  };

  imports: Imports = new Imports();

  // TODO: Do this a better way
  paramComponents = [
    {
      type: "GuStageParameter",
      names: ["stage", "stageparameter"],
    },
  ];

  constructor(cfnPath: string) {
    this.cfnPath = cfnPath;
  }

  parse = (): void => {
    try {
      const f = readFileSync(this.cfnPath, "utf8");

      // TODO: Handle json files too
      const cfn = load(f, { schema: CDK_SCHEMA }) as CFNTemplate;

      this.parseParameters(cfn);
    } catch (e) {
      let msg = "Unknown Error";
      if (e instanceof Error) {
        msg = e.message;
      }
      throw new Error(`Failed to parse template file - ${msg}`);
    }
  };

  parseParameters = (cfn: CFNTemplate): void => {
    Object.keys(cfn.Parameters).forEach((key) => {
      const parameters = camelCaseObjectKeys(cfn.Parameters[key]);

      const similarConstuct = this.getSimilarConstructs(key);
      if (similarConstuct) {
        parameters.comment = similarConstuct;
      }

      if (parameters.type === "String") {
        this.imports.addImport("@guardian/cdk/lib/constructs/core", [
          "GuStringParameter",
        ]);
        this.template.Parameters[key] = {
          ...parameters,
          parameterType: "GuStringParameter",
        };
      } else {
        this.imports.addImport("@guardian/cdk/lib/constructs/core", [
          "GuParameter",
        ]);
        this.template.Parameters[key] = {
          ...parameters,
          parameterType: "GuParameter",
        };
      }
    });
  };

  getSimilarConstructs(name: string): string | void {
    for (const p of this.paramComponents) {
      if (p.names.includes(toCamelCase(name).toLowerCase())) {
        return `Your parameter looks similar to ${p.type}. Consider using that instead.`;
      }
    }
  }
}

export const parse = (
  cfnPath: string
): { imports: Imports; template: CDKTemplate } => {
  const parser = new CfnParser(cfnPath);
  parser.parse();
  return {
    imports: parser.imports,
    template: parser.template,
  };
};
