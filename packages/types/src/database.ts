export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "DEVELOPER" | "DESIGNER" | "STAKEHOLDER";
  skills?: string[];
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  ai_risk_score: number | null;
  predicted_completion: string | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "BACKLOG" | "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
  ai_estimated_hours: number | null;
  project_id: string;
  assignee_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  project_id: string;
  user_id: string;
  role: "OWNER" | "DEVELOPER";
  users?: User; // For joined queries
}

export interface TaskDependency {
  task_id: string;
  dependency_id: string;
  tasks?: Task; // For joined queries
}
