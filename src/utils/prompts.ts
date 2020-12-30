import prompts from "prompts";
import type { Answers, Options, PromptObject } from "prompts";

export const cancellablePrompts = async <T extends string = string>(
  p: PromptObject<T> | Array<PromptObject<T>>,
  options: Options = {}
): Promise<Answers<T>> => {
  return await prompts(p, {
    onCancel: () => {
      throw new Error("Process aborted");
    },
    ...options,
  });
};
