import { Resolvers } from "@apollo/client";
import { projectRepository } from "@/lib/data/project-repository";
import { taskRepository } from "@/lib/data/task-repository";
import { userRepository } from "@/lib/data/user-repository";
import { aiService } from "@/lib/services/ai";
import { GraphQLContext } from "@repo/types";
import type {
  Project,
  ProjectMemberRole,
  Task,
  User,
} from "@repo/schema";
import { projectMemberRoleEnum, taskStatusEnum } from "@repo/schema";
import { ProjectMember } from "@repo/schema";

export const resolvers: Resolvers = {
  Query: {
    // Project queries
    projects: async (_, __, context: GraphQLContext) => {
      if (!context.userId) throw new Error("Authentication required");
      const { projects } = await projectRepository.getAllProjects();
      return projects;
    },

    project: async (_, { id }: Project, context: GraphQLContext) => {
      if (!context.userId) throw new Error("Authentication required");
      return projectRepository.getProject(id);
    },

    projectsByTeamMember: async (
      _,
      { userId }: { userId: string },
      context: GraphQLContext,
    ) => {
      if (!context.userId) throw new Error("Authentication required");
      return projectRepository.getProjectsByTeamMember(userId);
    },

    projectsWithRiskAnalysis: async (_, __, context: GraphQLContext) => {
      if (!context.userId) throw new Error("Authentication required");
      return projectRepository.getProjectsWithRiskAnalysis();
    },

    // Task queries
    tasks: async (
      _,
      { projectId }: { projectId: string },
      context: GraphQLContext,
    ) => {
      if (!context.userId) throw new Error("Authentication required");
      return taskRepository.getTasksByProject(projectId);
    },

    task: async (_, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.userId) throw new Error("Authentication required");
      return taskRepository.getTask(id);
    },

    tasksByAssignee: async (
      _,
      { userId }: { userId: string },
      context: GraphQLContext,
    ) => {
      if (!context.userId) throw new Error("Authentication required");
      return taskRepository.getTasksByAssignee(userId);
    },

    // User queries
    users: async (_, __, context: GraphQLContext) => {
      if (!context.userId) throw new Error("Authentication required");
      return userRepository.getAllUsers();
    },

    user: async (_, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.userId) throw new Error("Authentication required");
      return userRepository.getUser(id);
    },

    // Analytics queries
    sprintReport: async (
      _,
      { projectId, startDate, endDate }: {
        projectId: string;
        startDate: string;
        endDate: string;
      },
      context: GraphQLContext,
    ) => {
      if (!context.userId) throw new Error("Authentication required");
      return aiService.generateSprintReport(projectId, startDate, endDate);
    },

    teamPerformance: async (
      _,
      { projectId }: { projectId: string },
      context: GraphQLContext,
    ) => {
      if (!context.userId) throw new Error("Authentication required");
      return aiService.analyzeTeamPerformance(projectId);
    },

    // Real-time queries
    activeUsers: async (
      _,
      __,
      context: GraphQLContext,
    ) => {
      if (!context.userId) throw new Error("Authentication required");
      // TODO: This would be implemented with Appwrite Realtime
      return []; // Placeholder
    },
  },

  Mutation: {
    // Project mutations
    createProject: async (
      _,
      { input }: { input: Project },
      context: GraphQLContext,
    ) => {
      if (!context.userId) throw new Error("Authentication required");

      const project = await projectRepository.createProject({
        name: input.name,
        description: input.description || null,
        aiRiskScore: null,
        predictedCompletion: null,
      });

      // Add team members if specified
      if (input.teamMembers && input.teamMembers.length > 0) {
        for (const member of input.teamMembers) {
          const userId = member.userId;
          await projectRepository.addTeamMember(
            project.id,
            userId,
            userId === context.userId
              ? projectMemberRoleEnum.Enum.OWNER
              : projectMemberRoleEnum.Enum.DEVELOPER,
          );
        }
      } else {
        // Add current user as owner
        await projectRepository.addTeamMember(
          project.id,
          context.userId,
          projectMemberRoleEnum.Enum.OWNER,
        );
      }

      // Generate AI risk score and predicted completion
      if (project.description) {
        const aiAnalysis = await aiService.analyzeProjectRisks(project.id);
        if (aiAnalysis.length > 0) {
          interface RiskFactor {
            severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
          }

          const avgRiskScore: number =
            aiAnalysis.reduce((sum: number, risk: RiskFactor): number => {
              const severityScore: number = risk.severity === "LOW"
                ? 0.25
                : risk.severity === "MEDIUM"
                ? 0.5
                : risk.severity === "HIGH"
                ? 0.75
                : 1.0;
              return sum + severityScore;
            }, 0) / aiAnalysis.length;

          await projectRepository.updateProject(project.id, {
            aiRiskScore: avgRiskScore,
          });

          // Update the project object
          project.aiRiskScore = avgRiskScore;
        }
      }

      return project;
    },

    updateProject: async (
      _,
      { id, input }: { id: string; input: Project },
      context: GraphQLContext,
    ) => {
      if (!context.userId) throw new Error("Authentication required");

      // Verify user has access to this project
      const project = await projectRepository.getProject(id);
      const hasAccess = project.teamMembers?.some((member: ProjectMember) =>
        member.userId === context.userId
      );
      if (!hasAccess) throw new Error("Access denied");

      return projectRepository.updateProject(id, {
        name: input.name,
        description: input.description,
        // Don't update AI fields directly
      });
    },

    deleteProject: async (
      _,
      { id }: { id: string },
      context: GraphQLContext,
    ) => {
      if (!context.userId) throw new Error("Authentication required");

      // Verify user is the owner
      const project = await projectRepository.getProject(id);
      const isOwner = project.teamMembers?.some(
        (member: ProjectMember) =>
          member.userId === context.userId &&
          member.role === projectMemberRoleEnum.Enum.OWNER,
      );
      if (!isOwner) throw new Error("Only project owners can delete projects");

      return projectRepository.deleteProject(id);
    },

    // Task mutations
    createTask: async (
      _,
      { input }: { input: Task },
      context: GraphQLContext,
    ) => {
      if (!context.userId) throw new Error("Authentication required");

      // Verify user has access to this project
      const project = await projectRepository.getProject(input.projectId);
      const hasAccess = project.teamMembers?.some((member: ProjectMember) =>
        member.userId === context.userId
      );
      if (!hasAccess) throw new Error("Access denied");

      const task = await taskRepository.createTask({
        title: input.title,
        description: input.description || null,
        status: input.status || taskStatusEnum.Enum.BACKLOG,
        projectId: input.projectId,
        assigneeId: input.assigneeId || null,
        aiEstimatedHours: null,
      });

      // Add dependencies if specified
      if (input.dependencies && input.dependencies.length > 0) {
        for (const dependency of input.dependencies) {
          await taskRepository.addTaskDependency(task.id, dependency.id);
        }
      }

      // Generate AI estimated hours
      if (task.description) {
        const aiPrediction = await aiService.generateTaskEstimate(task.id);
        if (aiPrediction) {
          await taskRepository.updateTask(task.id, {
            aiEstimatedHours: aiPrediction.estimatedHours,
          });

          // Update the task object
          task.aiEstimatedHours = aiPrediction.estimatedHours;
        }
      }

      return task;
    },

    updateTask: async (
      _,
      { id, input }: { id: string; input: Task },
      context: GraphQLContext,
    ) => {
      if (!context.userId) throw new Error("Authentication required");

      // Verify user has access to this task's project
      const task = await taskRepository.getTask(id);
      const project = await projectRepository.getProject(task.projectId);
      const hasAccess = project.teamMembers?.some((member: ProjectMember) =>
        member.userId === context.userId
      );
      if (!hasAccess) throw new Error("Access denied");

      return taskRepository.updateTask(id, {
        title: input.title,
        description: input.description,
        status: input.status,
        assigneeId: input.assigneeId,
        projectId: input.projectId,
      });
    },

    deleteTask: async (_, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.userId) throw new Error("Authentication required");

      // Verify user has access to this task's project
      const task = await taskRepository.getTask(id);
      const project = await projectRepository.getProject(task.projectId);
      const hasAccess = project.teamMembers?.some((member: ProjectMember) =>
        member.userId === context.userId
      );
      if (!hasAccess) throw new Error("Access denied");

      return taskRepository.deleteTask(id);
    },

    // Team member mutations
    addTeamMember: async (
      _,
      { projectId, userId, role }: {
        projectId: string;
        userId: string;
        role: ProjectMemberRole;
      },
      context: GraphQLContext,
    ) => {
      if (!context.userId) throw new Error("Authentication required");

      // Verify current user is the owner
      const project = await projectRepository.getProject(projectId);
      const isOwner = project.teamMembers?.some(
        (member: ProjectMember) =>
          member.userId === context.userId &&
          member.role === projectMemberRoleEnum.Enum.OWNER,
      );
      if (!isOwner) throw new Error("Only project owners can add team members");

      return projectRepository.addTeamMember(projectId, userId, role);
    },

    // AI mutations
    generateTaskEstimate: async (
      _,
      { taskId }: { taskId: string },
      context: GraphQLContext,
    ) => {
      if (!context.userId) throw new Error("Authentication required");

      const task = await taskRepository.getTask(taskId);
      const project = await projectRepository.getProject(task.projectId);
      const hasAccess = project.teamMembers?.some((member: ProjectMember) =>
        member.userId === context.userId
      );
      if (!hasAccess) throw new Error("Access denied");

      const prediction = await aiService.generateTaskEstimate(taskId);

      // Update the task with the estimate
      await taskRepository.updateTask(taskId, {
        aiEstimatedHours: prediction.estimatedHours,
      });

      return prediction;
    },

    analyzeProjectRisks: async (
      _,
      { projectId }: { projectId: string },
      context: GraphQLContext,
    ) => {
      if (!context.userId) throw new Error("Authentication required");

      const project = await projectRepository.getProject(projectId);
      const hasAccess = project.teamMembers?.some((member: ProjectMember) =>
        member.userId === context.userId
      );
      if (!hasAccess) throw new Error("Access denied");

      const riskFactors = await aiService.analyzeProjectRisks(projectId);

      // Update the project with the average risk score
      if (riskFactors.length > 0) {
        const avgRiskScore = riskFactors.reduce((sum, risk) => {
          const severityScore = risk.severity === "LOW"
            ? 0.25
            : risk.severity === "MEDIUM"
            ? 0.5
            : risk.severity === "HIGH"
            ? 0.75
            : 1.0;
          return sum + severityScore;
        }, 0) / riskFactors.length;

        await projectRepository.updateProject(projectId, {
          aiRiskScore: avgRiskScore,
        });
      }

      return riskFactors;
    },
  },

  // Type resolvers
  Project: {
    tasks: async (parent: Project) => {
      if (parent.tasks) return parent.tasks;
      return taskRepository.getTasksByProject(parent.id);
    },
    teamMembers: async (parent: Project) => {
      if (parent.teamMembers) {
        // If teamMembers already includes user data, return as is
        if (parent.teamMembers[0]?.user) return parent.teamMembers;

        // Otherwise, fetch user data for each team member
        return Promise.all(parent.teamMembers.map(async (member: ProjectMember) => {
          const user = await userRepository.getUser(member.userId);
          return { ...member, user };
        }));
      }

      // If teamMembers not included, fetch them
      const members = await projectRepository.getProjectMembers(parent.id);
      return Promise.all(members.map(async (member: ProjectMember) => {
        const user = await userRepository.getUser(member.userId);
        return { ...member, user };
      }));
    },
  },

  Task: {
    assignee: async (parent: Task) => {
      if (!parent.assigneeId) return null;
      if (parent.assignee) return parent.assignee;
      return userRepository.getUser(parent.assigneeId);
    },
    dependencies: async (parent: Task) => {
      if (parent.dependencies) return parent.dependencies;
      return taskRepository.getTaskDependencies(parent.id);
    },
    project: async (parent: Task) => {
      return projectRepository.getProject(parent.projectId);
    },
  },

  User: {
    projects: async (parent: User) => {
      return projectRepository.getProjectsByTeamMember(parent.id);
    },
  },
};
