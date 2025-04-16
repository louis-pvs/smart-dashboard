import { z } from "zod";
import { userSchema } from "./user";

// Task status enum
export const taskStatusEnum = z.enum([
  "BACKLOG",
  "TODO",
  "IN_PROGRESS",
  "REVIEW",
  "DONE",
]);

// Base task schema without relations
export const taskBaseSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(255),
  description: z.string().nullable(),
  status: taskStatusEnum,
  aiEstimatedHours: z.number().nullable(),
  projectId: z.string().min(1),
  assigneeId: z.string().nullable(),
  createdAt: z.string(), // ISO date string
  updatedAt: z.string(), // ISO date string
});

// Task dependency schema
export const taskDependencySchema = z.object({
  taskId: z.string().min(1),
  dependencyId: z.string().min(1),
  task: z.lazy(() => taskSchema).optional(),
});

// Schema for creating a task dependency
export const createTaskDependencySchema = z.object({
  taskId: z.string().min(1),
  dependencyId: z.string().min(1),
});


export const updateTaskDependencySchema = z.object({
  taskId: z.string().min(1),
  dependencyId: z.string().min(1),
});

// Task schema with relations
export const taskSchema: z.ZodType<{
  [K in keyof z.infer<typeof taskBaseSchema>]: z.infer<typeof taskBaseSchema>[K];
} & {
  assignee?: z.infer<typeof userSchema> | null;
  dependencies?: z.infer<typeof taskSchema>[];
}> = taskBaseSchema.extend({
  assignee: z.lazy(() => userSchema).nullable().optional(),
  dependencies: z.array(z.lazy(() => taskSchema)).optional(),
});

// Schema for creating a task
export const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
  status: taskStatusEnum.optional().default("BACKLOG"),
  aiEstimatedHours: z.number().nullable().optional(),
  projectId: z.string().min(1),
  assigneeId: z.string().nullable().optional(),
});

// Schema for updating a task
export const updateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().nullable().optional(),
  status: taskStatusEnum.optional(),
  aiEstimatedHours: z.number().nullable().optional(),
  projectId: z.string().min(1).optional(),
  assigneeId: z.string().nullable().optional(),
});

// Type definitions
export type Task = z.infer<typeof taskSchema>;
export type TaskStatus = z.infer<typeof taskStatusEnum>;
export type CreateTask = z.infer<typeof createTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;
export type TaskDependency = z.infer<typeof taskDependencySchema>;
export type CreateTaskDependency = z.infer<typeof createTaskDependencySchema>;
export type UpdateTaskDependency = z.infer<typeof updateTaskDependencySchema>;
