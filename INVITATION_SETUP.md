# Project Invitation System Setup Guide

This guide explains how to set up and use the project invitation system that allows users to invite team members via email. When a user who doesn't exist in the system receives an invitation, they can sign up and automatically join the project.

## Features

1. **Email-based Invitations**: Send invitations to team members via email
2. **Automatic Registration**: New users can sign up via OAuth (Google/GitHub) and automatically join the project
3. **Existing User Handling**: Users who already exist in the system are added directly to the team
4. **React Email Templates**: Beautiful email templates using React Email
5. **Invitation Management**: Track invitation status (pending, accepted, expired)

## Setup Steps

### 1. Install Dependencies

```bash
npm install @react-email/components @react-email/render resend
```

### 2. Set Up Resend

1. Sign up for a Resend account at https://resend.com
2. Create an API key
3. Add it to your `.env.local` file:
   ```env
   RESEND_API_KEY=re_your-api-key-here
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   ```

### 3. Create Database Table

Run the following SQL in your Supabase SQL editor to create the `project_invitations` table:

```sql
CREATE TABLE project_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  invited_by TEXT NOT NULL REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  accepted_by TEXT REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX idx_project_invitations_token ON project_invitations(token);
CREATE INDEX idx_project_invitations_email ON project_invitations(email);
CREATE INDEX idx_project_invitations_status ON project_invitations(status);
```

### 4. Configure Environment Variables

Add the following to your `.env.local` file (see `ENV_SETUP.md` for details):

```env
RESEND_API_KEY=re_your-api-key-here
RESEND_FROM_EMAIL=noreply@yourdomain.com
NEXTAUTH_URL=http://localhost:3000
```

## How It Works

### 1. Adding Team Members

When a user adds team members via email:

1. The system checks if each email exists in the `users` table
2. **Existing users**: Added directly to the `team_members` table
3. **New users**: 
   - An invitation record is created in `project_invitations`
   - An invitation email is sent with a unique token
   - The user can click the link to sign up and join

### 2. Invitation Acceptance Flow

1. **User clicks invitation link**: Redirects to `/invite/accept?token=xxx&project=yyy`
2. **If not authenticated**: User sees sign-in options (Google/GitHub)
3. **If authenticated**: Invitation is automatically accepted
4. **After OAuth login**: 
   - User is created/updated in the `users` table
   - Pending invitations for that email are automatically accepted
   - User is added to the `team_members` table
   - User is redirected to the project page

### 3. Automatic Invitation Acceptance

The system automatically accepts invitations when:
- A user signs up via OAuth with an email that has pending invitations
- A user logs in and visits an invitation link while authenticated

## File Structure

```
app/
  actions/
    invitationActions.ts       # Server actions for invitation management
    projectaActions.ts          # Updated to handle invitations
  emails/
    ProjectInvitationEmail.tsx  # React Email template
  invite/
    accept/
      page.tsx                  # Invitation acceptance page
      InviteAcceptContent.tsx   # Client component for acceptance flow
lib/
  emails/
    sendInvitationEmail.ts      # Email sending utility
```

## API Reference

### `addTeamMembersAction(projectId: string, emails: string[])`

Adds team members to a project. Returns:
- `addedMembers`: Array of team members added directly (existing users)
- `invitationsSent`: Number of invitations sent (new users)

### `acceptInvitationAction(token: string, userId: string)`

Accepts an invitation for an authenticated user.

### `getInvitationAction(token: string)`

Gets invitation details by token.

## Testing

1. **Test with existing user**:
   - Add an email that exists in the `users` table
   - User should be added directly to the team

2. **Test with new user**:
   - Add an email that doesn't exist in the `users` table
   - Check that invitation is created in database
   - Check email inbox for invitation
   - Click invitation link
   - Sign up via OAuth
   - Verify user is added to team

3. **Test invitation expiration**:
   - Create an invitation with expired date
   - Verify it cannot be accepted

## Troubleshooting

### Emails not sending

1. Check `RESEND_API_KEY` is set correctly
2. Verify Resend API key is valid
3. Check Resend dashboard for delivery status
4. Check server logs for errors

### Invitations not being accepted

1. Verify `project_invitations` table exists
2. Check invitation token is valid
3. Verify invitation hasn't expired
4. Check user email matches invitation email
5. Check server logs for errors

### Database errors

1. Verify `project_invitations` table is created
2. Check foreign key constraints
3. Verify indexes are created
4. Check Supabase logs for errors

## Next Steps

1. Customize email template in `app/emails/ProjectInvitationEmail.tsx`
2. Add email notifications for invitation acceptance
3. Add ability to resend invitations
4. Add invitation management UI
5. Add invitation expiration cleanup job

