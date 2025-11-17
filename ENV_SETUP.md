# Environment Variables Setup

This document describes the environment variables required for the project planner application.

## Required Environment Variables

### NextAuth Configuration
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here
```

### OAuth Providers
```env
# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Supabase Configuration
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-supabase-service-key
```

### Resend Email Configuration
```env
# Resend API Key (required for sending invitation emails)
RESEND_API_KEY=re_your-resend-api-key

# Resend From Email (optional, defaults to onboarding@resend.dev)
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### Application URL (Optional)
```env
# Used for generating invitation links (falls back to NEXTAUTH_URL if not set)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Setup Instructions

1. **Create a `.env.local` file** in the root of your project
2. **Add all required environment variables** with your actual values
3. **Generate NextAuth Secret**:
   ```bash
   openssl rand -base64 32
   ```
   Or use an online generator: https://generate-secret.vercel.app/32

4. **Set up Resend**:
   - Sign up at https://resend.com
   - Create an API key
   - Add it to your `.env.local` file
   - Optionally, verify your domain and set `RESEND_FROM_EMAIL`

5. **Set up OAuth providers** (see `SUPABASE_SETUP.md` for detailed instructions)

## Notes

- Never commit `.env.local` to version control
- The `RESEND_API_KEY` is required for sending invitation emails
- If `RESEND_FROM_EMAIL` is not set, emails will be sent from `onboarding@resend.dev`
- For production, update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your production domain

