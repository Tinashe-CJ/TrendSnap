# Social Login Setup Guide

This guide explains how to set up OAuth providers for social login in TrendSnap.

## Required Environment Variables

Add these to your `.env` file:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret

# Apple OAuth (Optional)
APPLE_CLIENT_ID=your-apple-client-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY_PATH=path/to/your/apple/private/key.p8

# Frontend URL for redirects
FRONTEND_URL=http://localhost:3000
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set Application Type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3001/api/auth/social/google/callback` (development)
   - `https://yourdomain.com/api/auth/social/google/callback` (production)
7. Copy Client ID and Client Secret to your `.env` file

## Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select existing one
3. Add Facebook Login product
4. Go to Settings → Basic
5. Add your domain to App Domains
6. Go to Facebook Login → Settings
7. Add Valid OAuth Redirect URIs:
   - `http://localhost:3001/api/auth/social/facebook/callback` (development)
   - `https://yourdomain.com/api/auth/social/facebook/callback` (production)
8. Copy App ID and App Secret to your `.env` file

## Apple OAuth Setup (Optional)

1. Go to [Apple Developer](https://developer.apple.com/)
2. Create a new App ID
3. Enable Sign In with Apple
4. Create a Services ID
5. Configure domains and redirect URLs
6. Generate a private key
7. Copy all credentials to your `.env` file

## API Endpoints

### OAuth Initiation
- `GET /api/auth/social/google` - Start Google OAuth flow
- `GET /api/auth/social/facebook` - Start Facebook OAuth flow
- `GET /api/auth/social/apple` - Start Apple OAuth flow

### OAuth Callbacks
- `GET /api/auth/social/google/callback` - Google OAuth callback
- `GET /api/auth/social/facebook/callback` - Facebook OAuth callback
- `GET /api/auth/social/apple/callback` - Apple OAuth callback

### Account Management
- `POST /api/auth/social/link/:provider` - Link social account to existing user
- `DELETE /api/auth/social/unlink/:provider` - Unlink social account

## Frontend Integration

The OAuth flow redirects users back to your frontend with a JWT token:

```
http://localhost:3000/dashboard?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Extract the token from the URL and store it in your frontend authentication system.

## Security Notes

- Always use HTTPS in production
- Store secrets securely (never commit to version control)
- Validate tokens on the server side
- Implement proper error handling for OAuth failures
- Consider implementing CSRF protection

## Testing

1. Start the backend server: `npm run dev`
2. Test OAuth endpoints with a tool like Postman
3. Verify user creation and token generation
4. Test account linking/unlinking functionality 