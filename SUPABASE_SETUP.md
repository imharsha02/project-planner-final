# NextAuth Authentication Setup

This project is configured with NextAuth.js supporting both GitHub and Google authentication providers. Follow these steps to complete the setup:

## 1. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the application details:
   - **Application name**: Your Project Name
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click **Register application**
5. Copy the **Client ID** and generate a **Client Secret**

## 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to **APIs & Services** > **Library**
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **OAuth 2.0 Client IDs**
   - Choose **Web application**
   - Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
5. Copy the **Client ID** and **Client Secret**

## 3. Configure Environment Variables

Create a `.env.local` file in your project root with the following content:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Replace the values with your actual OAuth credentials.

## 4. Generate NextAuth Secret

Generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

Or use an online generator like [generate-secret.vercel.app](https://generate-secret.vercel.app/32)

## 5. Test the Authentication

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Try signing in with GitHub or Google
4. Verify that you're redirected back to your application

## Features Included

- ✅ GitHub OAuth authentication
- ✅ Google OAuth authentication
- ✅ Server-side authentication helpers
- ✅ Client-side authentication components
- ✅ Automatic session management
- ✅ Secure cookie handling

## Troubleshooting

### Common Issues:

1. **"Invalid client" error**: Check that your OAuth app credentials are correct
2. **Redirect URI mismatch**: Verify your callback URLs match exactly
3. **CORS errors**: Ensure your NEXTAUTH_URL is set correctly

### Debug Steps:

1. Check browser console for errors
2. Verify environment variables are loaded
3. Check OAuth provider dashboards for authentication logs
4. Ensure your OAuth applications are properly configured

## Next Steps

Once authentication is working, you can:
- Add user profiles and database integration
- Implement role-based access control
- Add additional OAuth providers
- Set up custom login pages
- Add middleware for protected routes
