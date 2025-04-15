import { Resolvers } from "@apollo/client";
import { createProjectSchema, updateProjectSchema } from "@repo/schema";
import { createTaskSchema, updateTaskSchema } from "@repo/schema";

import {
  ProjectMemberWithUser,
  TaskDependencyWithTask,
  GraphQLContext
} from "@repo/types";

export const resolvers: Resolvers = {
  Query: {
    // Project queries
    projects: async (_, __, { supabase, userId }: GraphQLContext) => {
      if (!userId) throw new Error("Authentication required");

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },

    project: async (_, { id }, { supabase, userId }) => {
      if (!userId) throw new Error("Authentication required");

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },

    // Task queries
    tasks: async (_, { projectId }, { supabase, userId }) => {
      if (!userId) throw new Error("Authentication required");

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },

    task: async (_, { id }, { supabase, userId }) => {
      if (!userId) throw new Error("Authentication required");

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },

    // User queries
    users: async (_, __, { supabase, userId }) => {
      if (!userId) throw new Error("Authentication required");

      const { data, error } = await supabase.from("users").select("*");

      if (error) throw new Error(error.message);
      return data;
    },

    user: async (_, { id }, { supabase, userId }) => {
      if (!userId) throw new Error("Authentication required");

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
  },

  Mutation: {
    // Project mutations
    createProject: async (_, { input }, { supabase, userId }) => {
      if (!userId) throw new Error("Authentication required");

      // Validate input with Zod
      const validatedInput = createProjectSchema.parse(input);

      // Add project to database
      const { data, error } = await supabase
        .from("projects")
        .insert({
          name: validatedInput.name,
          description: validatedInput.description,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);

      // Add team members if provided
      if (
        validatedInput.teamMemberIds &&
        validatedInput.teamMemberIds.length > 0
      ) {
        const teamMembers = validatedInput.teamMemberIds.map((memberId) => ({
          project_id: data.id,
          user_id: memberId,
          role: "DEVELOPER",
        }));

        const { error: memberError } = await supabase
          .from("project_members")
          .insert(teamMembers);

        if (memberError) throw new Error(memberError.message);
      }

      // Add the creator as an owner
      const { error: ownerError } = await supabase
        .from("project_members")
        .insert({
          project_id: data.id,
          user_id: userId,
          role: "OWNER",
        });

      if (ownerError) throw new Error(ownerError.message);

      return data;
    },

    updateProject: async (_, { id, input }, { supabase, userId }) => {
      if (!userId) throw new Error("Authentication required");

      // Validate input with Zod
      const validatedInput = updateProjectSchema.parse(input);

      // Update project
      const { data, error } = await supabase
        .from("projects")
        .update(validatedInput)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      // Update team members if provided
      if (validatedInput.teamMemberIds) {
        // First, remove all existing members except the owner
        await supabase
          .from("project_members")
          .delete()
          .eq("project_id", id)
          .neq("role", "OWNER");

        // Then add the new members
        const teamMembers = validatedInput.teamMemberIds.map((memberId) => ({
          project_id: id,
          user_id: memberId,
          role: "DEVELOPER",
        }));

        if (teamMembers.length > 0) {
          const { error: memberError } = await supabase
            .from("project_members")
            .insert(teamMembers);

          if (memberError) throw new Error(memberError.message);
        }
      }

      return data;
    },

    deleteProject: async (_, { id }, { supabase, userId }) => {
      if (!userId) throw new Error("Authentication required");

      // Check if user is the owner
      const { data: memberData, error: memberError } = await supabase
        .from("project_members")
        .select("role")
        .eq("project_id", id)
        .eq("user_id", userId)
        .single();

      if (memberError) throw new Error(memberError.message);
      if (memberData.role !== "OWNER")
        throw new Error("Only project owners can delete projects");

      // Delete project
      const { error } = await supabase.from("projects").delete().eq("id", id);

      if (error) throw new Error(error.message);

      return true;
    },

    // Task mutations
    createTask: async (_, { input }, { supabase, userId }) => {
      if (!userId) throw new Error("Authentication required");

      // Validate input with Zod
      const validatedInput = createTaskSchema.parse(input);

      // Add task to database
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          title: validatedInput.title,
          description: validatedInput.description,
          status: validatedInput.status,
          assignee_id: validatedInput.assigneeId,
          project_id: validatedInput.projectId,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);

      // Add dependencies if provided
      if (
        validatedInput.dependencyIds &&
        validatedInput.dependencyIds.length > 0
      ) {
        const dependencies = validatedInput.dependencyIds.map((depId) => ({
          task_id: data.id,
          dependency_id: depId,
        }));

        const { error: depError } = await supabase
          .from("task_dependencies")
          .insert(dependencies);

        if (depError) throw new Error(depError.message);
      }

      return data;
    },

    updateTask: async (_, { id, input }, { supabase, userId }) => {
      if (!userId) throw new Error("Authentication required");

      // Validate input with Zod
      const validatedInput = updateTaskSchema.parse(input);

      // Update task
      const { data, error } = await supabase
        .from("tasks")
        .update({
          title: validatedInput.title,
          description: validatedInput.description,
          status: validatedInput.status,
          assignee_id: validatedInput.assigneeId,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      // Update dependencies if provided
      if (validatedInput.dependencyIds) {
        // First, remove all existing dependencies
        await supabase.from("task_dependencies").delete().eq("task_id", id);

        // Then add the new dependencies
        if (validatedInput.dependencyIds.length > 0) {
          const dependencies = validatedInput.dependencyIds.map((depId) => ({
            task_id: id,
            dependency_id: depId,
          }));

          const { error: depError } = await supabase
            .from("task_dependencies")
            .insert(dependencies);

          if (depError) throw new Error(depError.message);
        }
      }

      return data;
    },

    deleteTask: async (_, { id }, { supabase, userId }) => {
      if (!userId) throw new Error("Authentication required");

      // Delete task
      const { error } = await supabase.from("tasks").delete().eq("id", id);

      if (error) throw new Error(error.message);

      return true;
    },
  },

  // Field resolvers
  Project: {
    tasks: async (parent, _, { supabase }) => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("project_id", parent.id);

      if (error) throw new Error(error.message);
      return data;
    },

    teamMembers: async (parent, _, { supabase }) => {
      const { data, error } = await supabase
        .from("project_members")
        .select("users(*)")
        .eq("project_id", parent.id);

      if (error) throw new Error(error.message);
      return (data as ProjectMemberWithUser[]).map((item) => item.users);
    },
  },

  Task: {
    assignee: async (parent, _, { supabase }) => {
      if (!parent.assignee_id) return null;

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", parent.assignee_id)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },

    dependencies: async (parent, _, { supabase }) => {
      const { data, error } = await supabase
        .from("task_dependencies")
        .select("tasks(*)")
        .eq("task_id", parent.id);

      if (error) throw new Error(error.message);
      return (data as TaskDependencyWithTask[]).map((item) => item.tasks);
    },

    project: async (parent, _, { supabase }) => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", parent.project_id)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
  },
};
