import { z } from "zod";

// AI prediction schema
export const aiPredictionSchema = z.object({
  taskId: z.string().min(1),
  estimatedHours: z.number().nonnegative(),
  confidence: z.number().min(0).max(1),
  createdAt: z.string(), // ISO date string
});

// Type definition
export type AIPrediction = z.infer<typeof aiPredictionSchema>;
