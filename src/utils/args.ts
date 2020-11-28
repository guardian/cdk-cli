import { existsSync } from "fs";
import { toPascalCase } from "codemaker";

export const getStackNameFromFileName = (filename: string): string => {
  // Split on . and get first element to remove any extensions
  // Replace anything which is a space, word char, underscore or hyphen
  // Convert to PascalCase
  // Remove any remaining special chars
  return toPascalCase(
    filename.split(".")[0].replace(/[^\w\s_-]/gi, "")
  ).replace(/[^\w]/gi, "");
};

export const checkPathExists = (path: string): void => {
  if (!existsSync(path)) {
    throw new Error(`File not found - ${path}`);
  }
};
