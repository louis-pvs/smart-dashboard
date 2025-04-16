import { z } from "zod";

// Risk severity enum
export const riskSeverityEnum = z.enum([
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
]);

// Risk factor schema
export const riskFactorSchema = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
  description: z.string(),
  severity: riskSeverityEnum,
  mitigationSuggestion: z.string(),
  createdAt: z.string(), // ISO date string
});

// Type definitions
export type RiskFactor = z.infer<typeof riskFactorSchema>;
export type RiskSeverity = z.infer<typeof riskSeverityEnum>;
