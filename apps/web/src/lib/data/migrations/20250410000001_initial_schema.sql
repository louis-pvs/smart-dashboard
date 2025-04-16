-- Enable pgvector extension for AI features
CREATE EXTENSION IF NOT EXISTS vector;

-- Projects table
CREATE TABLE
    projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        name TEXT NOT NULL,
        description TEXT,
        ai_risk_score FLOAT,
        predicted_completion TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );

-- Tasks table
CREATE TABLE
    tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'BACKLOG',
        ai_estimated_hours FLOAT,
        project_id UUID NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
        assignee_id UUID REFERENCES auth.users (id),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );

-- Task dependencies
CREATE TABLE
    task_dependencies (
        task_id UUID REFERENCES tasks (id) ON DELETE CASCADE,
        dependency_id UUID REFERENCES tasks (id) ON DELETE CASCADE,
        PRIMARY KEY (task_id, dependency_id)
    );

-- Project team members
CREATE TABLE
    project_members (
        project_id UUID REFERENCES projects (id) ON DELETE CASCADE,
        user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE,
        role TEXT NOT NULL DEFAULT 'DEVELOPER',
        PRIMARY KEY (project_id, user_id)
    );

-- AI cache for optimization
CREATE TABLE
    ai_cache (
        input_hash TEXT PRIMARY KEY,
        result JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

ALTER TABLE task_dependencies ENABLE ROW LEVEL SECURITY;

ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

ALTER TABLE ai_cache ENABLE ROW LEVEL SECURITY;