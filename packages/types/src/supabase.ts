import { User, Task, ProjectMember, TaskDependency } from '@/types/database';

export interface SupabaseQueryResponse<T> {
  data: T | null;
  error: Error | null;
}

// For joined queries with users
export interface ProjectMemberWithUser extends ProjectMember {
  users: User;
}

// For joined queries with tasks
export interface TaskDependencyWithTask extends TaskDependency {
  tasks: Task;
}
