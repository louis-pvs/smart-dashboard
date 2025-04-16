import { z } from "zod";

// User role enum
export const userRoleEnum = z.enum([
  "ADMIN",
  "MANAGER",
  "DEVELOPER",
  "DESIGNER",
  "STAKEHOLDER",
]);

// User schema
export const userSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(255),
  email: z.string().email(),
  role: userRoleEnum,
  skills: z.array(z.string()).optional(),
  avatar: z.string().url().optional(),
});

// Schema for creating a user
export const createUserSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  role: userRoleEnum,
  skills: z.array(z.string()).optional(),
  avatar: z.string().url().optional(),
});

// Schema for updating a user
export const updateUserSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
  role: userRoleEnum.optional(),
  skills: z.array(z.string()).optional(),
  avatar: z.string().url().optional(),
});

// Type definitions
export type User = z.infer<typeof userSchema>;
export type UserRole = z.infer<typeof userRoleEnum>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
