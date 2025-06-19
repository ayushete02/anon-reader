# Google OAuth Setup Instructions

## 1. Google Cloud Console Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Select "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - Your production domain (for production)
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)

## 2. Environment Variables

Update your `.env.local` file with the credentials from Google Cloud Console:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_here
```

### Generate NEXTAUTH_SECRET

You can generate a secure secret using one of these methods:

```bash
# Method 1: Using OpenSSL
openssl rand -base64 32

# Method 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 3. Features Implemented

- ✅ Google OAuth integration with NextAuth.js
- ✅ Automatic user creation from Google profile
- ✅ Local storage integration for offline persistence
- ✅ Session management across page refreshes
- ✅ Secure logout that clears both Google session and local storage
- ✅ Error handling for authentication failures
- ✅ Loading states for better UX
- ✅ Integration with existing user context system

## 4. How It Works

1. **Login Flow**:
   - User clicks Google sign-in button
   - Redirected to Google OAuth consent screen
   - After approval, redirected back to app with session
   - User data extracted from Google profile and saved to localStorage
   - User is logged into the app context

2. **Session Persistence**:
   - NextAuth manages the Google OAuth session
   - User data is also stored in localStorage for consistency
   - On page refresh, the app checks both session and localStorage

3. **Logout Flow**:
   - Clears NextAuth session
   - Clears localStorage data
   - Redirects to home page

## 5. Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`
3. Click the Google sign-in button
4. Complete the OAuth flow
5. Verify you're logged in and redirected appropriately

## 6. Security Notes

- Never commit your `.env.local` file to version control
- Use different client IDs for development and production
- Regularly rotate your NEXTAUTH_SECRET
- Ensure your redirect URIs are correctly configured in Google Cloud Console
