import { z } from "zod";

// Team performance metric schema
export const teamPerformanceMetricSchema = z.object({
  userId: z.string().min(1),
  completedTasks: z.number().int().nonnegative(),
  averageCompletionTime: z.number().nonnegative(),
  estimationAccuracy: z.number().min(0).max(1),
});

// Type definition
export type TeamPerformanceMetric = z.infer<typeof teamPerformanceMetricSchema>;
