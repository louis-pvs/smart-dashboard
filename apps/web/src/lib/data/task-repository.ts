import { databases, ID, Query } from "@/lib/appwrite/client";
import { AppwriteCollections } from "@repo/types";
import { Task, TaskDependency, TaskStatus } from "@repo/schema";

// Constants for Appwrite configuration
const DATABASE_ID = "smartDashboard";
const TASKS_COLLECTION_ID = "tasks";
const TASK_DEPENDENCIES_COLLECTION_ID = "taskDependencies";

export class TaskRepository {
  /**
   * Get a task by ID with related data
   */
  async getTask(id: string): Promise<Task> {
    try {
      const task = await databases.getDocument<
        AppwriteCollections["tasks"]["Read"]
      >(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        id,
      );

      // Transform to domain model
      return {
        id: task.$id,
        title: task.title,
        description: task.description,
        status: task.status,
        aiEstimatedHours: task.aiEstimatedHours,
        projectId: task.projectId,
        assigneeId: task.assigneeId,
        createdAt: task.$createdAt,
        updatedAt: task.$updatedAt,
      };
    } catch (error) {
      console.error("Error fetching task:", error);
      throw error;
    }
  }

  /**
   * Get all tasks for a project
   */
  async getTasksByProject(projectId: string): Promise<Task[]> {
    try {
      const result = await databases.listDocuments<
        AppwriteCollections["tasks"]["Read"]
      >(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        [Query.equal("projectId", projectId)],
      );

      // Map each task
      return result.documents.map((doc) => ({
        id: doc.$id,
        title: doc.title,
        description: doc.description,
        status: doc.status,
        aiEstimatedHours: doc.aiEstimatedHours,
        projectId: doc.projectId,
        assigneeId: doc.assigneeId,
        createdAt: doc.$createdAt,
        updatedAt: doc.$updatedAt,
      }));
    } catch (error) {
      console.error("Error fetching tasks by project:", error);
      throw error;
    }
  }

  /**
   * Get all tasks assigned to a user
   */
  async getTasksByAssignee(userId: string): Promise<Task[]> {
    try {
      const result = await databases.listDocuments<
        AppwriteCollections["tasks"]["Read"]
      >(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        [Query.equal("assigneeId", userId)],
      );

      // Map each task
      return result.documents.map((doc) => ({
        id: doc.$id,
        title: doc.title,
        description: doc.description,
        status: doc.status,
        aiEstimatedHours: doc.aiEstimatedHours,
        projectId: doc.projectId,
        assigneeId: doc.assigneeId,
        createdAt: doc.$createdAt,
        updatedAt: doc.$updatedAt,
      }));
    } catch (error) {
      console.error("Error fetching tasks by assignee:", error);
      throw error;
    }
  }

  /**
   * Create a new task
   */
  async createTask(
    data: Omit<Task, "id" | "createdAt" | "updatedAt">,
  ): Promise<Task> {
    try {
      const task = await databases.createDocument<
        AppwriteCollections["tasks"]["Read"]
      >(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        ID.unique(),
        {
          title: data.title,
          description: data.description,
          status: data.status,
          aiEstimatedHours: data.aiEstimatedHours,
          projectId: data.projectId,
          assigneeId: data.assigneeId,
        },
      );

      // Return the created task
      return {
        id: task.$id,
        title: task.title,
        description: task.description,
        status: task.status,
        aiEstimatedHours: task.aiEstimatedHours,
        projectId: task.projectId,
        assigneeId: task.assigneeId,
        createdAt: task.$createdAt,
        updatedAt: task.$updatedAt,
      };
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  /**
   * Update an existing task
   */
  async updateTask(
    id: string,
    data: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Task> {
    try {
      // Build update object with only defined fields
      const updateData: Partial<AppwriteCollections["tasks"]["Update"]> = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) {
        updateData.description = data.description;
      }
      if (data.status !== undefined) updateData.status = data.status as AppwriteCollections["tasks"]["Update"]["status"];
      if (data.aiEstimatedHours !== undefined) {
        updateData.aiEstimatedHours = data.aiEstimatedHours;
      }
      if (data.projectId !== undefined) updateData.projectId = data.projectId;
      if (data.assigneeId !== undefined) {
        updateData.assigneeId = data.assigneeId;
      }

      // Update document in Appwrite
      const task = await databases.updateDocument<
        AppwriteCollections["tasks"]["Read"]
      >(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        id,
        updateData,
      );

      // Return the updated task
      return {
        id: task.$id,
        title: task.title,
        description: task.description,
        status: task.status,
        aiEstimatedHours: task.aiEstimatedHours,
        projectId: task.projectId,
        assigneeId: task.assigneeId,
        createdAt: task.$createdAt,
        updatedAt: task.$updatedAt,
      };
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<boolean> {
    try {
      // First delete all dependencies
      const dependencies = await this.getTaskDependencies(id);

      // Delete dependencies in parallel
      await Promise.all(
        dependencies.map((dep) =>
          databases.deleteDocument(
            DATABASE_ID,
            TASK_DEPENDENCIES_COLLECTION_ID,
            `${dep.taskId}_${dep.dependencyId}`,
          )
        ),
      );

      // Delete the task itself
      await databases.deleteDocument(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        id,
      );

      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }

  /**
   * Add a task dependency
   */
  async addTaskDependency(
    taskId: string,
    dependencyId: string,
  ): Promise<TaskDependency> {
    try {
      // Use a composite ID for easier querying
      const dependencyDocId = `${taskId}_${dependencyId}`;

      const dependency = await databases.createDocument<
        AppwriteCollections["taskDependencies"]["Read"]
      >(
        DATABASE_ID,
        TASK_DEPENDENCIES_COLLECTION_ID,
        dependencyDocId,
        {
          taskId,
          dependencyId,
        },
      );

      return {
        taskId: dependency.taskId,
        dependencyId: dependency.dependencyId,
      };
    } catch (error) {
      console.error("Error adding task dependency:", error);
      throw error;
    }
  }

  /**
   * Remove a task dependency
   */
  async removeTaskDependency(
    taskId: string,
    dependencyId: string,
  ): Promise<boolean> {
    try {
      // Use the composite ID
      const dependencyDocId = `${taskId}_${dependencyId}`;

      await databases.deleteDocument(
        DATABASE_ID,
        TASK_DEPENDENCIES_COLLECTION_ID,
        dependencyDocId,
      );

      return true;
    } catch (error) {
      console.error("Error removing task dependency:", error);
      throw error;
    }
  }

  /**
   * Get all dependencies for a task
   */
  async getTaskDependencies(taskId: string): Promise<TaskDependency[]> {
    try {
      const result = await databases.listDocuments<
        AppwriteCollections["taskDependencies"]["Read"]
      >(
        DATABASE_ID,
        TASK_DEPENDENCIES_COLLECTION_ID,
        [Query.equal("taskId", taskId)],
      );

      return result.documents.map((doc) => ({
        taskId: doc.taskId,
        dependencyId: doc.dependencyId,
      }));
    } catch (error) {
      console.error("Error fetching task dependencies:", error);
      throw error;
    }
  }

  /**
   * Get all tasks that depend on a specific task
   */
  async getDependentTasks(dependencyId: string): Promise<TaskDependency[]> {
    try {
      const result = await databases.listDocuments<
        AppwriteCollections["taskDependencies"]["Read"]
      >(
        DATABASE_ID,
        TASK_DEPENDENCIES_COLLECTION_ID,
        [Query.equal("dependencyId", dependencyId)],
      );

      return result.documents.map((doc) => ({
        taskId: doc.taskId,
        dependencyId: doc.dependencyId,
      }));
    } catch (error) {
      console.error("Error fetching dependent tasks:", error);
      throw error;
    }
  }

  /**
   * Get tasks by status
   */
  async getTasksByStatus(
    projectId: string,
    status: TaskStatus,
  ): Promise<Task[]> {
    try {
      const result = await databases.listDocuments<
        AppwriteCollections["tasks"]["Read"]
      >(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        [
          Query.equal("projectId", projectId),
          Query.equal("status", status),
        ],
      );

      return result.documents.map((doc) => ({
        id: doc.$id,
        title: doc.title,
        description: doc.description,
        status: doc.status,
        aiEstimatedHours: doc.aiEstimatedHours,
        projectId: doc.projectId,
        assigneeId: doc.assigneeId,
        createdAt: doc.$createdAt,
        updatedAt: doc.$updatedAt,
      }));
    } catch (error) {
      console.error(`Error fetching tasks with status ${status}:`, error);
      throw error;
    }
  }
}

// Singleton instance
export const taskRepository = new TaskRepository();
