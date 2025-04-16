import { databases, ID, Query } from "@/lib/appwrite/client";
import { AppwriteCollections } from "@repo/types";
import { Project, ProjectMember } from "@repo/schema";

// Constants for Appwrite configuration
const DATABASE_ID = "smartDashboard";
const PROJECTS_COLLECTION_ID = "projects";
const TASKS_COLLECTION_ID = "tasks";
const PROJECT_MEMBERS_COLLECTION_ID = "projectMembers";

export class ProjectRepository {
  /**
   * Get a project by ID with related data
   */
  async getProject(id: string): Promise<Project> {
    try {
      const project = await databases.getDocument<AppwriteCollections['projects']['Read']>(
        DATABASE_ID,
        PROJECTS_COLLECTION_ID,
        id
      );

      // Fetch related tasks
      const tasksResult = await databases.listDocuments<AppwriteCollections['tasks']['Read']>(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        [Query.equal("projectId", id)]
      );

      // Fetch team members
      const membersResult = await databases.listDocuments<AppwriteCollections['projectMembers']['Read']>(
        DATABASE_ID,
        PROJECT_MEMBERS_COLLECTION_ID,
        [Query.equal("projectId", id)]
      );

      // Transform to our domain model
      return {
        id: project.$id,
        name: project.name,
        description: project.description,
        aiRiskScore: project.aiRiskScore,
        predictedCompletion: project.predictedCompletion,
        createdAt: project.$createdAt,
        updatedAt: project.$updatedAt,
        tasks: tasksResult.documents.map(task => ({
          id: task.$id,
          title: task.title,
          description: task.description,
          status: task.status,
          aiEstimatedHours: task.aiEstimatedHours,
          projectId: task.projectId,
          assigneeId: task.assigneeId,
          createdAt: task.$createdAt,
          updatedAt: task.$updatedAt
        })),
        teamMembers: membersResult.documents.map(member => ({
          projectId: member.projectId,
          userId: member.userId,
          role: member.role
        }))
      };
    } catch (error) {
      console.error("Error fetching project:", error);
      throw error;
    }
  }

  /**
   * Get all projects
   */
  async getAllProjects(): Promise<{ total: number; projects: Project[] }> {
    try {
      const result = await databases.listDocuments<AppwriteCollections['projects']['Read']>(
        DATABASE_ID,
        PROJECTS_COLLECTION_ID
      );

      // Map each project (without related data for performance)
      const projects = result.documents.map(doc => ({
        id: doc.$id,
        name: doc.name,
        description: doc.description,
        aiRiskScore: doc.aiRiskScore,
        predictedCompletion: doc.predictedCompletion,
        createdAt: doc.$createdAt,
        updatedAt: doc.$updatedAt
      }));

      return {
        total: result.total,
        projects
      };
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  }

  /**
   * Create a new project
   */
  async createProject(data: Omit<Project, "id" | "createdAt" | "updatedAt" | "tasks" | "teamMembers">): Promise<Project> {
    try {
      // Create document in Appwrite
      const project = await databases.createDocument<AppwriteCollections['projects']['Read']>(
        DATABASE_ID,
        PROJECTS_COLLECTION_ID,
        ID.unique(),
        {
          name: data.name,
          description: data.description,
          aiRiskScore: data.aiRiskScore,
          predictedCompletion: data.predictedCompletion
        }
      );

      // Return the created project
      return {
        id: project.$id,
        name: project.name,
        description: project.description,
        aiRiskScore: project.aiRiskScore,
        predictedCompletion: project.predictedCompletion,
        createdAt: project.$createdAt,
        updatedAt: project.$updatedAt,
        tasks: [],
        teamMembers: []
      };
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  /**
   * Update an existing project
   */
  async updateProject(id: string, data: Partial<Omit<Project, "id" | "createdAt" | "updatedAt" | "tasks" | "teamMembers">>): Promise<Project> {
    try {
      // Update document in Appwrite
      const project = await databases.updateDocument<AppwriteCollections['projects']['Read']>(
        DATABASE_ID,
        PROJECTS_COLLECTION_ID,
        id,
        {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.aiRiskScore !== undefined && { aiRiskScore: data.aiRiskScore }),
          ...(data.predictedCompletion !== undefined && { predictedCompletion: data.predictedCompletion })
        }
      );

      // Fetch related tasks for the complete project object
      const tasksResult = await databases.listDocuments<AppwriteCollections['tasks']['Read']>(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        [Query.equal("projectId", id)]
      );

      // Fetch team members
      const membersResult = await databases.listDocuments<AppwriteCollections['projectMembers']['Read']>(
        DATABASE_ID,
        PROJECT_MEMBERS_COLLECTION_ID,
        [Query.equal("projectId", id)]
      );

      // Return the updated project with related data
      return {
        id: project.$id,
        name: project.name,
        description: project.description,
        aiRiskScore: project.aiRiskScore,
        predictedCompletion: project.predictedCompletion,
        createdAt: project.$createdAt,
        updatedAt: project.$updatedAt,
        tasks: tasksResult.documents.map(task => ({
          id: task.$id,
          title: task.title,
          description: task.description,
          status: task.status,
          aiEstimatedHours: task.aiEstimatedHours,
          projectId: task.projectId,
          assigneeId: task.assigneeId,
          createdAt: task.$createdAt,
          updatedAt: task.$updatedAt
        })),
        teamMembers: membersResult.documents.map(member => ({
          projectId: member.projectId,
          userId: member.userId,
          role: member.role
        }))
      };
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  }

  /**
   * Delete a project
   */
  async deleteProject(id: string): Promise<boolean> {
    try {
      // First delete all associated tasks
      const tasksResult = await databases.listDocuments(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        [Query.equal("projectId", id)]
      );

      // Delete tasks in parallel
      await Promise.all(
        tasksResult.documents.map(task =>
          databases.deleteDocument(
            DATABASE_ID,
            TASKS_COLLECTION_ID,
            task.$id
          )
        )
      );

      // Delete all project members
      const membersResult = await databases.listDocuments(
        DATABASE_ID,
        PROJECT_MEMBERS_COLLECTION_ID,
        [Query.equal("projectId", id)]
      );

      // Delete project members in parallel
      await Promise.all(
        membersResult.documents.map(member =>
          databases.deleteDocument(
            DATABASE_ID,
            PROJECT_MEMBERS_COLLECTION_ID,
            member.$id
          )
        )
      );

      // Finally delete the project itself
      await databases.deleteDocument(
        DATABASE_ID,
        PROJECTS_COLLECTION_ID,
        id
      );

      return true;
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  }

  /**
   * Add a team member to a project
   */
  async addTeamMember(projectId: string, userId: string, role: ProjectMember['role']): Promise<ProjectMember> {
    try {
      const member = await databases.createDocument<AppwriteCollections['projectMembers']['Read']>(
        DATABASE_ID,
        PROJECT_MEMBERS_COLLECTION_ID,
        ID.unique(),
        {
          project_id: projectId,
          user_id: userId,
          role
        }
      );

      return {
        projectId: member.projectId,
        userId: member.userId,
        role: member.role
      };
    } catch (error) {
      console.error("Error adding team member:", error);
      throw error;
    }
  }

  /**
   * Get projects by team member ID
   */
  async getProjectsByTeamMember(userId: string): Promise<Project[]> {
    try {
      // First get all project memberships for this user
      const membershipsResult = await databases.listDocuments<AppwriteCollections['projectMembers']['Read']>(
        DATABASE_ID,
        PROJECT_MEMBERS_COLLECTION_ID,
        [Query.equal("userId", userId)]
      );

      // Extract project IDs
      const projectIds = membershipsResult.documents.map(doc => doc.projectId);

      if (projectIds.length === 0) {
        return [];
      }

      // Fetch all projects in those IDs
      const projects: Project[] = [];

      // Appwrite doesn't support "IN" queries directly, so we need to fetch each project
      for (const projectId of projectIds) {
        try {
          const project = await this.getProject(projectId);
          projects.push(project);
        } catch (error) {
          console.error(`Error fetching project ${projectId}:`, error);
          // Continue with other projects even if one fails
        }
      }

      return projects;
    } catch (error) {
      console.error("Error fetching projects by team member:", error);
      throw error;
    }
  }

  async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    try {
      const result = await databases.listDocuments<AppwriteCollections['projectMembers']['Read']>(
        DATABASE_ID,
        PROJECT_MEMBERS_COLLECTION_ID,
        [Query.equal("projectId", projectId)]
      );

      // Map each project member
      return result.documents.map(doc => ({
        projectId: doc.projectId,
        userId: doc.userId,
        role: doc.role
      }));
    } catch (error) {
      console.error("Error fetching project members:", error);
      throw error;
    }
  }

  /**
   * Get projects with AI risk analysis
   */
  async getProjectsWithRiskAnalysis(): Promise<Project[]> {
    try {
      const result = await databases.listDocuments<AppwriteCollections['projects']['Read']>(
        DATABASE_ID,
        PROJECTS_COLLECTION_ID,
        [Query.isNotNull("aiRiskScore")]
      );

      // Map projects with risk scores
      const projects = await Promise.all(
        result.documents.map(async doc => {
          // Get related data for each project
          return this.getProject(doc.$id);
        })
      );

      return projects;
    } catch (error) {
      console.error("Error fetching projects with risk analysis:", error);
      throw error;
    }
  }
}

// Singleton instance
export const projectRepository = new ProjectRepository();
