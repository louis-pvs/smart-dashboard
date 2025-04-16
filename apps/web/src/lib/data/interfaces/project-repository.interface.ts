import { Project, Task, User } from "@repo/schema";

export interface IProjectRepository {
  findById(id: string): Promise<Project | null>;
  findAll(): Promise<Project[]>;
  create(project: Omit<Project, 'id'>): Promise<Project | null>;
  update(id: string, project: Partial<Project>): Promise<Project | null>;
  delete(id: string): Promise<boolean>;
  getProjectWithRelations(id: string): Promise<Project & { tasks: Task[], teamMembers: User[] } | null>;
  updateRiskScore(id: string, score: number): Promise<boolean>;
  updatePredictedCompletion(id: string, date: string): Promise<boolean>;
}