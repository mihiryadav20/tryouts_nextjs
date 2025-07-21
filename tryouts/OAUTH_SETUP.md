# OAuth Setup Guide

## Environment Variables

To set up OAuth with Google, you need to add the following environment variables to your `.env` file:

```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/myproject"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## How to Get Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" and select "OAuth client ID"
5. Set the application type to "Web application"
6. Add "http://localhost:3000" to the Authorized JavaScript origins
7. Add "http://localhost:3000/api/auth/callback/google" to the Authorized redirect URIs
8. Click "Create" to generate your client ID and client secret
9. Copy these values to your `.env` file

## Testing the OAuth Flow

1. Make sure your database is running and accessible
2. Start your Next.js development server with `npm run dev`
3. Navigate to the homepage and click "Sign in with Google"
4. You should be redirected to Google's authentication page
5. After signing in, you should be redirected back to your application and see your profile information

## Troubleshooting

- If you encounter database connection issues, make sure your `DATABASE_URL` is correct
- If the OAuth flow fails, check that your Google OAuth credentials are correct and that the redirect URIs match exactly
- Make sure you've run `npx prisma db push` to create the necessary database tables
