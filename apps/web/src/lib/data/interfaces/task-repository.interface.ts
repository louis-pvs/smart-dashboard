import { Task } from "@repo/schema";

export interface ITaskRepository {
  findById(id: string): Promise<Task | null>;
  findAll(): Promise<Task[]>;
  create(task: Omit<Task, 'id'>): Promise<Task | null>;
  update(id: string, task: Partial<Task>): Promise<Task | null>;
  delete(id: string): Promise<boolean>;
  findByProjectId(projectId: string): Promise<Task[]>;
  findByAssigneeId(assigneeId: string): Promise<Task[]>;
  updateTaskStatus(id: string, status: string): Promise<boolean>;
  updateEstimatedHours(id: string, hours: number): Promise<boolean>;
  getTaskWithDependencies(id: string): Promise<Task & { dependencies: Task[] } | null>;
}