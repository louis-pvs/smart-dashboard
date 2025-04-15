import { z } from "zod";

// Base schema for project data
export const projectSchema = z.object({
  name: z.string().min(3, {
    message: "Project name must be at least 3 characters",
  }),
  description: z.string().optional(),
  teamMemberIds: z.array(z.string().uuid()).optional(),
});

// Schema for creating a new project
export const createProjectSchema = projectSchema;

// Schema for updating an existing project
export const updateProjectSchema = projectSchema.partial();

// Type inference
export type Project = z.infer<typeof projectSchema>;
export type CreateProject = z.infer<typeof createProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
