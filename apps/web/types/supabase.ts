export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          ai_risk_score: number | null;
          predicted_completion: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          ai_risk_score?: number | null;
          predicted_completion?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          ai_risk_score?: number | null;
          predicted_completion?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          status: string;
          ai_estimated_hours: number | null;
          project_id: string;
          assignee_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          status?: string;
          ai_estimated_hours?: number | null;
          project_id: string;
          assignee_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          status?: string;
          ai_estimated_hours?: number | null;
          project_id?: string;
          assignee_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      task_dependencies: {
        Row: {
          task_id: string;
          dependency_id: string;
        };
        Insert: {
          task_id: string;
          dependency_id: string;
        };
        Update: {
          task_id?: string;
          dependency_id?: string;
        };
      };
      project_members: {
        Row: {
          project_id: string;
          user_id: string;
          role: string;
        };
        Insert: {
          project_id: string;
          user_id: string;
          role?: string;
        };
        Update: {
          project_id?: string;
          user_id?: string;
          role?: string;
        };
      };
      ai_cache: {
        Row: {
          input_hash: string;
          result: Json;
          created_at: string;
        };
        Insert: {
          input_hash: string;
          result: Json;
          created_at?: string;
        };
        Update: {
          input_hash?: string;
          result?: Json;
          created_at?: string;
        };
      };
    };
  };
}
