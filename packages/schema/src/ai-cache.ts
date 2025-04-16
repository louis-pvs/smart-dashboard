// @repo/schema/src/ai-cache.ts
import { z } from "zod";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Define the JSON type
export const jsonSchema: z.ZodType<Json> = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.lazy(() => z.array(jsonSchema)),
  z.lazy(() => z.record(jsonSchema))
]);

// AI Cache schema
export const aiCacheSchema = z.object({
  id: z.string().min(1),
  inputHash: z.string().min(1),
  result: jsonSchema,
  createdAt: z.string(), // ISO date string
});

// Schema for creating an AI cache entry
export const createAICacheSchema = z.object({
  inputHash: z.string().min(1),
  result: jsonSchema,
});

// Schema for updating an AI cache entry
export const updateAICacheSchema = z.object({
  inputHash: z.string().min(1).optional(),
  result: jsonSchema.optional(),
});

// Type definitions
export type AICache = z.infer<typeof aiCacheSchema>;
export type CreateAICache = z.infer<typeof createAICacheSchema>;
export type UpdateAICache = z.infer<typeof updateAICacheSchema>;
