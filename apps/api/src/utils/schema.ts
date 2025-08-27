import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export function zodToFastifySchema(schema: z.ZodTypeAny) {
  return zodToJsonSchema(schema, { target: "jsonSchema7" });
}

export const ErrorResponseSchema = {
  type: "object",
  properties: {
    error: {
      type: "object",
      properties: {
        code: { type: "string" },
        message: { type: "string" },
        details: {},
      },
      required: ["code", "message"],
      additionalProperties: true,
    },
    requestId: { type: "string" },
  },
  required: ["error"],
  additionalProperties: false,
} as const;
