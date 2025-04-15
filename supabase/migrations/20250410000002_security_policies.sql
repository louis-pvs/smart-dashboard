-- Projects access policies
CREATE POLICY "Users can view projects they are members of" ON projects FOR
SELECT
    USING (
        EXISTS (
            SELECT
                1
            FROM
                project_members
            WHERE
                project_members.project_id = projects.id
                AND project_members.user_id = auth.uid ()
        )
    );

CREATE POLICY "Project owners can update their projects" ON projects FOR
UPDATE USING (
    EXISTS (
        SELECT
            1
        FROM
            project_members
        WHERE
            project_members.project_id = projects.id
            AND project_members.user_id = auth.uid ()
            AND project_members.role = 'owner'
    )
);

-- Tasks access policies
CREATE POLICY "Users can view tasks for their projects" ON tasks FOR
SELECT
    USING (
        EXISTS (
            SELECT
                1
            FROM
                project_members
            WHERE
                project_members.project_id = tasks.project_id
                AND project_members.user_id = auth.uid ()
        )
    );

CREATE POLICY "Users can update tasks assigned to them" ON tasks FOR
UPDATE USING (
    tasks.assignee_id = auth.uid ()
    OR EXISTS (
        SELECT
            1
        FROM
            project_members
        WHERE
            project_members.project_id = tasks.project_id
            AND project_members.user_id = auth.uid ()
            AND (
                project_members.role = 'owner'
                OR project_members.role = 'admin'
            )
    )
);