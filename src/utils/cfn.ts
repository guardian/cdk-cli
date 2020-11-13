import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { toCamelCase } from 'codemaker';
import { Config } from './args';
import { Imports } from './imports';
import { CDKTemplate } from './cdk';

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

class CfnParser {
  config: Config;

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

  parseParameters = (cfn: CFNTemplate) => {
    Object.keys(cfn.Parameters).forEach((key) => {
      const param = cfn.Parameters[key];

      // TODO: Do this a better way
      const parameters: { [key: string]: any } = {};
      Object.keys(param).reduce(
        (c, k) => ((parameters[toCamelCase(k)] = param[k]), c),
        {}
      );

      for (const p of this.paramComponents) {
        if (p.names.includes(key.toLowerCase())) {
          parameters.comment = `Your parameter looks similar to ${p.type}. Consider using that instead.`;
        }
      }

      if (param.Type === 'String') {
        this.imports.addImport('../components/core', {
          type: 'component',
          components: ['GuStringParameter'],
        });
        this.template.Parameters[key] = {
          ...parameters,
          parameterType: 'GuStringParameter',
        };
      } else {
        this.imports.addImport('../components/core', {
          type: 'component',
          components: ['GuParameter'],
        });
        this.template.Parameters[key] = {
          ...parameters,
          parameterType: 'GuParameter',
        };
      }
    });
  };
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
