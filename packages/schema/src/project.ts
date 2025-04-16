import { z } from "zod";
import { taskSchema } from "./task";
import { projectMemberSchema } from "./project-member";

// Base project schema without relations
export const projectBaseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(255),
  description: z.string().nullable(),
  aiRiskScore: z.number().nullable(),
  predictedCompletion: z.string().nullable(), // ISO date string
  createdAt: z.string(), // ISO date string
  updatedAt: z.string(), // ISO date string
});

// Project schema with relations
export const projectSchema = projectBaseSchema.extend({
  tasks: z.array(z.lazy(() => taskSchema)).optional(),
  teamMembers: z.array(z.lazy(() => projectMemberSchema)).optional(),
});

// Schema for creating a project
export const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
  aiRiskScore: z.number().nullable().optional(),
  predictedCompletion: z.string().nullable().optional(), // ISO date string
});

// Schema for updating a project
export const updateProjectSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().nullable().optional(),
  aiRiskScore: z.number().nullable().optional(),
  predictedCompletion: z.string().nullable().optional(), // ISO date string
});

// Type definitions
export type Project = z.infer<typeof projectSchema>;
export type CreateProject = z.infer<typeof createProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
