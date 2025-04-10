INSERT INTO
    projects (name, description)
VALUES
    (
        'Smart Dashboard MVP',
        'Initial version of the dashboard with core features'
    ),
    (
        'AI Risk Prediction Module',
        'Machine learning module for project risk assessment'
    );

-- Add some sample tasks
INSERT INTO
    tasks (title, description, status, project_id)
VALUES
    (
        'Setup authentication flow',
        'Implement Supabase auth with SSR support',
        'TODO',
        (
            SELECT
                id
            FROM
                projects
            WHERE
                name = 'Smart Dashboard MVP'
        )
    ),
    (
        'Create dashboard layout',
        'Design and implement the main dashboard UI',
        'BACKLOG',
        (
            SELECT
                id
            FROM
                projects
            WHERE
                name = 'Smart Dashboard MVP'
        )
    ),
    (
        'Train risk prediction model',
        'Use historical project data to train the model',
        'BACKLOG',
        (
            SELECT
                id
            FROM
                projects
            WHERE
                name = 'AI Risk Prediction Module'
        )
    );