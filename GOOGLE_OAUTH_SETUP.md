# Google OAuth Setup Guide for Mental Buddy

This guide walks you through setting up Google Login for your Mental Buddy MERN application.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click the project dropdown at the top and select **"New Project"**
4. Enter a project name: `Mental Buddy` (or your preference)
5. Click **"Create"** and wait for the project to be created
6. Once created, the new project will be automatically selected

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to **"APIs & Services"** > **"Library"**
2. Search for **"Google+ API"** in the search bar
3. Click on **"Google+ API"** from the results
4. Click the **"Enable"** button
5. You'll see a message: "API enabled" ✓

## Step 3: Create OAuth 2.0 Credentials

1. In the Google Cloud Console, go to **"APIs & Services"** > **"Credentials"**
2. Click the **"+ Create Credentials"** button at the top
3. Select **"OAuth client ID"**
4. If prompted to create a consent screen first, follow the OAuth Consent Screen setup below

## Step 4: Set Up OAuth Consent Screen (If Required)

1. In **"APIs & Services"**, click on **"OAuth consent screen"**
2. Select **"External"** as the User Type and click **"Create"**
3. Fill in the form:
   - **App name**: Mental Buddy
   - **User support email**: your-email@gmail.com
   - **Developer contact**: your-email@gmail.com
4. Click **"Save and Continue"**
5. Click **"Save and Continue"** on the Scopes page (no scopes required for this setup)
6. Click **"Save and Continue"** on the optional Test Users page
7. Review and click **"Back to Dashboard"**

## Step 5: Create OAuth 2.0 Client ID (Continued)

1. Go back to **"APIs & Services"** > **"Credentials"**
2. Click **"+ Create Credentials"** > **"OAuth client ID"**
3. Select **"Web application"** as the Application type
4. Enter a name: `Mental Buddy Web Client`
5. Under **"Authorized JavaScript origins"**, click **"+ Add URI"** and add:
   - `http://localhost:5173` (Vite dev server default port)
   - `http://localhost:3000` (alternative frontend port)
   - `http://localhost` (for testing)

6. Under **"Authorized redirect URIs"**, click **"+ Add URI"** and add:
   - `http://localhost:5173` 
   - `http://localhost:3000`
   - `http://localhost`

7. Click **"Create"**
8. A popup will show your credentials. Click **"Copy"** next to the Client ID

## Step 6: Add Client ID to Your Environment Files

### Frontend (.env.local)

Open `FRONT-END/.env.local` and update:

```env
VITE_GOOGLE_CLIENT_ID=your_copied_client_id_here
```

Paste your Client ID (the long string of numbers and letters).

### Backend (.env) - Optional but Recommended

For additional security, you can verify the Google token on the backend:

```env
GOOGLE_CLIENT_ID=your_copied_client_id_here
```

## Step 7: Test the Setup

1. **Start your backend server:**
   ```bash
   cd BACK-END
   npm install
   npm start
   ```

2. **Start your frontend dev server:**
   ```bash
   cd FRONT-END
   npm install
   npm run dev
   ```

3. **Navigate to the Login page** at `http://localhost:5173` (or your frontend URL)

4. **Click the "Continue with Google" button**

5. **Sign in with your Google account**

6. You should be redirected to the home page with a JWT token stored

## How It Works

### Frontend Flow

1. **Google Sign-In Button**: Rendered using Google Identity Services
2. **User clicks button**: Google sign-in popup appears
3. **User authenticates**: Google returns a credential token (JWT)
4. **Token decoded**: Frontend extracts `name`, `email`, and `googleId` (sub claim)
5. **Backend request**: Sends user data to `/api/auth/google`
6. **Token stored**: JWT from backend stored in `localStorage`

### Backend Flow

1. **Route**: `POST /api/auth/google`
2. **Check existing user**: Looks for user by `googleId` or `email`
3. **Existing user**: Generates JWT and returns
4. **New user**: Creates account in MongoDB and generates JWT
5. **Fields stored**: `name`, `email`, `googleId`, `createdAt`

## Database Schema

After Google login, users are stored in MongoDB with this structure:

```javascript
{
  _id: ObjectId,
  name: "User Name",          // From Google
  email: "user@gmail.com",    // From Google
  googleId: "123456789...",   // From Google (sub claim)
  createdAt: ISODate,         // Timestamp
  // Note: password field is omitted for Google users
}
```

## Troubleshooting

### "Google is not defined"
- Ensure the Google Sign-In script is loading
- Check if `import.meta.env.VITE_GOOGLE_CLIENT_ID` is set correctly
- Clear browser cache and reload

### "Client ID not found"
- Verify `.env.local` has the correct `VITE_GOOGLE_CLIENT_ID`
- Restart your frontend dev server after adding the env variable
- Check that the Client ID matches what you copied from Google Cloud

### "Redirect URI mismatch"
- Verify your frontend URL matches the authorized origins in Google Cloud
- For development with Vite, the default port is `5173`
- Update Google Cloud credentials if using a different port

### CORS Errors
- Ensure backend properly handles CORS
- The Google domain should be whitelisted in CORS configuration

### Token errors after sign-in
- Check backend `.env` has `JWT_SECRET` set
- Verify User model supports `googleId` field
- Check MongoDB connection is working

## Deployment Production Setup

When deploying to production:

1. **Update Authorized JavaScript origins** in Google Cloud:
   - Add your production domain, e.g., `https://mentalbuddy.com`

2. **Update .env.local** in production:
   - Use your production Google Client ID

3. **Update CORS settings** if needed for production domain

4. **Security**: Enable token verification on backend (optional but recommended):
   - Install `google-auth-library-nodejs`
   - Verify the Google credential token before accepting
   - This prevents token manipulation on the frontend

## Next Steps

- ✅ Google Login is now active
- Keep email/password login available as a fallback
- Consider adding social login for other providers (GitHub, Microsoft, etc.)
- Implement password reset for email/password users
- Set up email verification for traditional signups

---

For more information, visit:
- [Google Identity Services Documentation](https://developers.google.com/identity/gsi/web)
- [Google Cloud Console](https://console.cloud.google.com/)
- [JWT Documentation](https://jwt.io/)
