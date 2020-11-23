import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { Config } from './args';
import { toCamelCase } from 'codemaker';
import { Imports } from './imports';
import { CDKTemplate } from './cdk';
import { camelCaseObjectKeys } from './utils';

export interface CFNTemplate {
  Parameters: {
    [key: string]: { [key: string]: any };
  };
}

// TODO: Allow for all CDK tags
const CDK_SCHEMA = yaml.Schema.create([
  new yaml.Type('!Ref', {
    kind: 'scalar',
    construct: (data) => ({ Ref: data }),
  }),
  new yaml.Type('!Sub', {
    kind: 'scalar',
    construct: (data) => ({ 'Fn::Sub': data }),
  }),
  new yaml.Type('!GetAZs', {
    kind: 'scalar',
    construct: (data) => ({ 'Fn::GetAZs': data }),
  }),
]);

export class CfnParser {
  config: Config;

  // TODO: Make this its own class so that we can do addParameter?
  //       Then the builder would be part of that?
  template: CDKTemplate = {
    Parameters: {},
  };

  imports: Imports = new Imports();

  // TODO: Do this a better way
  paramComponents = [
    {
      type: 'GuStageParameter',
      names: ['stage', 'stageparameter'],
    },
  ];

  constructor(config: Config) {
    this.config = config;
  }

  parse = (): void => {
    try {
      const f = fs.readFileSync(this.config.cfnPath, 'utf8');

      // TODO: Handle json files too
      const cfn = yaml.safeLoad(f, { schema: CDK_SCHEMA }) as CFNTemplate;

      this.parseParameters(cfn);
    } catch (e) {
      throw new Error(`Failed to parse template file - ${e}`);
    }
  };

  parseParameters = (cfn: CFNTemplate): void => {
    Object.keys(cfn.Parameters).forEach((key) => {
      const parameters = camelCaseObjectKeys(cfn.Parameters[key]);

      const similarConstuct = this.getSimilarConstructs(key);
      if (similarConstuct) {
        parameters.comment = similarConstuct;
      }

      if (parameters.type === 'String') {
        this.imports.addImport('@guardian/cdk/lib/constructs/core', [
          'GuStringParameter',
        ]);
        this.template.Parameters[key] = {
          ...parameters,
          parameterType: 'GuStringParameter',
        };
      } else {
        this.imports.addImport('@guardian/cdk/lib/constructs/core', [
          'GuParameter',
        ]);
        this.template.Parameters[key] = {
          ...parameters,
          parameterType: 'GuParameter',
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
  config: Config
): { imports: Imports; template: CDKTemplate } => {
  const parser = new CfnParser(config);
  parser.parse();
  return {
    imports: parser.imports,
    template: parser.template,
  };
};
