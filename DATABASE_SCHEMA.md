# Database Schema

This document describes the database tables required for the project planner application.

## Existing Tables

### users
Stores user information.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  user_email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### projects
Stores project information.

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  project_name TEXT NOT NULL,
  project_description TEXT,
  department TEXT,
  start_date DATE,
  end_date DATE,
  thumbnail_url TEXT,
  is_group_project BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### team_members
Stores team members associated with projects.

```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  member_name TEXT NOT NULL,
  user_id TEXT REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### custom_steps_table
Stores project steps.

```sql
CREATE TABLE custom_steps_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  step TEXT NOT NULL,
  assigned_member_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## New Table: project_invitations

Stores project invitations sent to users who are not yet registered.

```sql
CREATE TABLE project_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  invited_by TEXT NOT NULL REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'expired'
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  accepted_by TEXT REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_project_invitations_token ON project_invitations(token);
CREATE INDEX idx_project_invitations_email ON project_invitations(email);
CREATE INDEX idx_project_invitations_status ON project_invitations(status);
```

## Setup Instructions

1. Connect to your Supabase database
2. Run the SQL commands above to create the `project_invitations` table
3. Ensure you have the necessary indexes for performance

## Notes

- The `project_invitations` table stores invitations sent to users who don't exist in the `users` table yet
- When a user accepts an invitation (after signing up), they are automatically added to the `team_members` table
- Invitations expire after 7 days (as configured in the application)
- The `status` field tracks the invitation state: 'pending', 'accepted', or 'expired'

