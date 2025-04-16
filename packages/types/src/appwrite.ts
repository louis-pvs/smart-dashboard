import { AICache, CreateAICache, CreateProject, CreateProjectMember, CreateTask, CreateTaskDependency, CreateUser, Project, ProjectMember, Task, TaskDependency, UpdateAICache, UpdateProject, UpdateProjectMember, UpdateTask, UpdateTaskDependency, UpdateUser, User } from "@repo/schema";

// Type for handling JSON data in Appwrite
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Appwrite model base interface with common properties
export interface AppwriteModel {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $collectionId: string;
  $databaseId: string;
}

// Type definitions for Appwrite collections
export interface AppwriteCollections {
  // Users collection
  users: {
    Read: AppwriteModel & User;
    Create: CreateUser;
    Update: UpdateUser;
  };

  // Projects collection
  projects: {
    Read: AppwriteModel & Project;
    Create: CreateProject;
    Update: UpdateProject;
  };

  // Tasks collection
  tasks: {
    Read: AppwriteModel & Task;
    Create: CreateTask;
    Update: UpdateTask;
  };

  // Task dependencies collection
  taskDependencies: {
    Read: AppwriteModel & TaskDependency;
    Create: CreateTaskDependency;
    Update: UpdateTaskDependency;
  };

  // Project members collection
  projectMembers: {
    Read: AppwriteModel & ProjectMember;
    Create: CreateProjectMember;
    Update: UpdateProjectMember;
  };

  // AI cache collection
  aiCache: {
    Read: AppwriteModel & AICache;
    Create: CreateAICache;
    Update: UpdateAICache;
  };
}

// Database type definition for Appwrite
export interface AppwriteDatabase {
  smartDashboard: AppwriteCollections;
}
