import { z } from "zod";

type ValidationPair<T> = [T, z.ZodType<T>];

export function validateInputs<T extends ValidationPair<any>[]>(
  ...pairs: T
): { [K in keyof T]: T[K] extends ValidationPair<infer U> ? U : never } {
  const parsedData: any[] = [];

  for (const [value, schema] of pairs) {
    const inputValidation = schema.safeParse(value);
    if (!inputValidation.success) {
      console.error(
        `Validation failed for ${JSON.stringify(value).substring(
          0,
          100
        )} and ${JSON.stringify(schema)}: ${inputValidation.error.message}`
      );
      throw new Error("Validation failed");
    }
    parsedData.push(inputValidation.data);
  }

  return parsedData as {
    [K in keyof T]: T[K] extends ValidationPair<infer U> ? U : never;
  };
}
