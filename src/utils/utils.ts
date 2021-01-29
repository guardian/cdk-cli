import { toCamelCase } from "codemaker";
import camelCase from "lodash.camelcase";
import upperFirst from "lodash.upperfirst";

export const camelCaseObjectKeys = (
  obj: Record<string, unknown>
): Record<string, unknown> => {
  const camelCasedObject: Record<string, unknown> = {};
  Object.keys(obj).reduce(
    (c, k) => ((camelCasedObject[toCamelCase(k)] = obj[k]), c),
    {}
  );

  return camelCasedObject;
};

export const pascalCase = (str: string): string => {
  return upperFirst(camelCase(str));
};

export interface Name {
  kebab: string;
  pascal: string;
}
