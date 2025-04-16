import { z } from "zod";
import { teamPerformanceMetricSchema } from "./team-performance-metric";

// Burndown point schema
export const burndownPointSchema = z.object({
  date: z.string(), // ISO date string
  remainingHours: z.number().nonnegative(),
  idealRemainingHours: z.number().nonnegative(),
});

// Sprint report schema
export const sprintReportSchema = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
  startDate: z.string(), // ISO date string
  endDate: z.string(), // ISO date string
  completedTasks: z.number().int().nonnegative(),
  burndownData: z.array(burndownPointSchema),
  teamPerformance: z.array(teamPerformanceMetricSchema),
  aiInsights: z.string(),
  createdAt: z.string(), // ISO date string
});

// Type definitions
export type BurndownPoint = z.infer<typeof burndownPointSchema>;
export type SprintReport = z.infer<typeof sprintReportSchema>;
