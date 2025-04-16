import { z } from "zod";
import { userSchema } from "./user";

// Project member role enum
export const projectMemberRoleEnum = z.enum([
  "OWNER",
  "DEVELOPER",
]);

// Project member schema
export const projectMemberSchema = z.object({
  projectId: z.string().min(1),
  userId: z.string().min(1),
  role: projectMemberRoleEnum,
  user: z.lazy(() => userSchema).optional(),
});

// Schema for creating a project member
export const createProjectMemberSchema = z.object({
  projectId: z.string().min(1),
  userId: z.string().min(1),
  role: projectMemberRoleEnum.default("DEVELOPER"),
});

// Schema for updating a project member
export const updateProjectMemberSchema = z.object({
  role: projectMemberRoleEnum.optional(),
});

// Type definitions
export type ProjectMember = z.infer<typeof projectMemberSchema>;
export type ProjectMemberRole = z.infer<typeof projectMemberRoleEnum>;
export type CreateProjectMember = z.infer<typeof createProjectMemberSchema>;
export type UpdateProjectMember = z.infer<typeof updateProjectMemberSchema>;
