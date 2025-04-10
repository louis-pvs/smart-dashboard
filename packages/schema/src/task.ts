import { z } from "zod";

// Task status enum
export const taskStatusEnum = z.enum([
  "BACKLOG",
  "TODO",
  "IN_PROGRESS",
  "REVIEW",
  "DONE",
]);

export type TaskStatus = z.infer<typeof taskStatusEnum>;

// Base schema for task data
export const taskSchema = z.object({
  title: z.string().min(3, {
    message: "Task title must be at least 3 characters",
  }),
  description: z.string().optional(),
  status: taskStatusEnum.default("BACKLOG"),
  assigneeId: z.string().uuid().optional(),
  projectId: z.string().uuid(),
  dependencyIds: z.array(z.string().uuid()).optional(),
  aiEstimatedHours: z.number().optional(),
});

// Schema for creating a new task
export const createTaskSchema = taskSchema;

// Schema for updating an existing task
export const updateTaskSchema = taskSchema.partial().omit({ projectId: true });

// Type inference
export type Task = z.infer<typeof taskSchema>;
export type CreateTask = z.infer<typeof createTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;
