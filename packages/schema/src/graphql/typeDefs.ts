// packages/schema/src/graphql/typeDefs.ts
import { gql } from "graphql-tag";
import { DocumentNode } from 'graphql';

export const typeDefs: DocumentNode = gql`
  type Project {
    id: ID!
    name: String!
    description: String
    tasks: [Task!]!
    aiRiskScore: Float
    predictedCompletion: String
    teamMembers: [User!]!
    createdAt: String!
    updatedAt: String!
  }

  type Task {
    id: ID!
    title: String!
    description: String
    status: TaskStatus!
    assignee: User
    aiEstimatedHours: Float
    dependencies: [Task!]
    project: Project!
    createdAt: String!
    updatedAt: String!
  }

  enum TaskStatus {
    BACKLOG
    TODO
    IN_PROGRESS
    REVIEW
    DONE
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: UserRole!
    skills: [String!]
    avatar: String
  }

  enum UserRole {
    ADMIN
    MANAGER
    DEVELOPER
    DESIGNER
    STAKEHOLDER
  }

  type Query {
    projects: [Project!]!
    project(id: ID!): Project
    tasks(projectId: ID!): [Task!]!
    task(id: ID!): Task
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createProject(input: ProjectInput!): Project!
    updateProject(id: ID!, input: ProjectInput!): Project!
    deleteProject(id: ID!): Boolean!

    createTask(input: TaskInput!): Task!
    updateTask(id: ID!, input: TaskInput!): Task!
    deleteTask(id: ID!): Boolean!
  }

  input ProjectInput {
    name: String!
    description: String
    teamMemberIds: [ID!]
  }

  input TaskInput {
    title: String!
    description: String
    status: TaskStatus
    assigneeId: ID
    projectId: ID!
    dependencyIds: [ID!]
  }
`;
