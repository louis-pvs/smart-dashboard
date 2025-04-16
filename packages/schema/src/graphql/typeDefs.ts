import { gql } from "graphql-tag";
import { DocumentNode } from 'graphql';

export const typeDefs: DocumentNode = gql`
  # Core types
  type Project {
    id: ID!
    name: String!
    description: String
    tasks: [Task!]!
    aiRiskScore: Float
    predictedCompletion: String
    teamMembers: [ProjectMember!]!
    riskFactors: [RiskFactor!]
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

  type User {
    id: ID!
    name: String!
    email: String!
    role: UserRole!
    skills: [String!]
    avatar: String
    projects: [Project!]
  }

  type ProjectMember {
    projectId: ID!
    userId: ID!
    role: ProjectMemberRole!
    user: User
  }

  type TaskDependency {
    taskId: ID!
    dependencyId: ID!
    task: Task
  }

  # AI and analytics types
  type AIPrediction {
    taskId: ID!
    estimatedHours: Float!
    confidence: Float!
    createdAt: String!
  }

  type RiskFactor {
    id: ID!
    projectId: ID!
    description: String!
    severity: RiskSeverity!
    mitigationSuggestion: String!
    createdAt: String!
  }

  type SprintReport {
    id: ID!
    projectId: ID!
    startDate: String!
    endDate: String!
    completedTasks: Int!
    burndownData: [BurndownPoint!]!
    teamPerformance: [TeamPerformanceMetric!]!
    aiInsights: String!
    createdAt: String!
  }

  type BurndownPoint {
    date: String!
    remainingHours: Float!
    idealRemainingHours: Float!
  }

  type TeamPerformanceMetric {
    userId: ID!
    completedTasks: Int!
    averageCompletionTime: Float!
    estimationAccuracy: Float!
  }

  type UserPresence {
    userId: ID!
    userName: String!
    userAvatar: String
    lastActive: String!
    currentView: String!
    currentTaskId: ID
  }

  # Enums
  enum TaskStatus {
    BACKLOG
    TODO
    IN_PROGRESS
    REVIEW
    DONE
  }

  enum UserRole {
    ADMIN
    MANAGER
    DEVELOPER
    DESIGNER
    STAKEHOLDER
  }

  enum ProjectMemberRole {
    OWNER
    DEVELOPER
  }

  enum RiskSeverity {
    LOW
    MEDIUM
    HIGH
    CRITICAL
  }

  # Queries
  type Query {
    # Project queries
    projects: [Project!]!
    project(id: ID!): Project
    projectsByTeamMember(userId: ID!): [Project!]!
    projectsWithRiskAnalysis: [Project!]!

    # Task queries
    tasks(projectId: ID!): [Task!]!
    task(id: ID!): Task
    tasksByAssignee(userId: ID!): [Task!]!

    # User queries
    users: [User!]!
    user(id: ID!): User

    # Analytics queries
    sprintReport(projectId: ID!, startDate: String!, endDate: String!): SprintReport
    teamPerformance(projectId: ID!): [TeamPerformanceMetric!]!

    # Real-time queries
    activeUsers(projectId: ID!): [UserPresence!]!
  }

  # Mutations
  type Mutation {
    # Project mutations
    createProject(input: ProjectInput!): Project!
    updateProject(id: ID!, input: ProjectUpdateInput!): Project!
    deleteProject(id: ID!): Boolean!

    # Task mutations
    createTask(input: TaskInput!): Task!
    updateTask(id: ID!, input: TaskUpdateInput!): Task!
    deleteTask(id: ID!): Boolean!

    # Project member mutations
    addTeamMember(projectId: ID!, userId: ID!, role: ProjectMemberRole!): ProjectMember!
    updateTeamMemberRole(projectId: ID!, userId: ID!, role: ProjectMemberRole!): ProjectMember!
    removeTeamMember(projectId: ID!, userId: ID!): Boolean!

    # Task dependency mutations
    addTaskDependency(taskId: ID!, dependencyId: ID!): TaskDependency!
    removeTaskDependency(taskId: ID!, dependencyId: ID!): Boolean!

    # AI mutations
    generateTaskEstimate(taskId: ID!): AIPrediction!
    analyzeProjectRisks(projectId: ID!): [RiskFactor!]!
    generateSprintReport(projectId: ID!, startDate: String!, endDate: String!): SprintReport!

    # User presence mutations
    updateUserPresence(input: UserPresenceInput!): UserPresence!
  }

  # Input types
  input ProjectInput {
    name: String!
    description: String
    teamMemberIds: [ID!]
  }

  input ProjectUpdateInput {
    name: String
    description: String
    aiRiskScore: Float
    predictedCompletion: String
  }

  input TaskInput {
    title: String!
    description: String
    status: TaskStatus
    assigneeId: ID
    projectId: ID!
    dependencyIds: [ID!]
  }

  input TaskUpdateInput {
    title: String
    description: String
    status: TaskStatus
    assigneeId: ID
    projectId: ID
    dependencyIds: [ID!]
  }

  input UserPresenceInput {
    userId: ID!
    projectId: ID!
    currentView: String!
    currentTaskId: ID
  }

  # Subscriptions for real-time features
  type Subscription {
    projectUpdated(projectId: ID!): Project!
    taskUpdated(projectId: ID!): Task!
    userPresenceChanged(projectId: ID!): UserPresence!
  }
`;
