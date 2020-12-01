import { toCamelCase } from "codemaker";

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
