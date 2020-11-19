import { toCamelCase } from 'codemaker';

export const camelCaseObjectKeys = (obj: {[key: string]: any}): {[key: string]: any} => {
  const camelCasedObject: { [key: string]: any } = {};
  Object.keys(obj).reduce(
    (c, k) => ((camelCasedObject[toCamelCase(k)] = obj[k]), c),
    {}
  );

  return camelCasedObject
}
