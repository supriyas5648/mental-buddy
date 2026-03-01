# Google OAuth - Quick Start Guide

## ⚡ 5-Minute Setup

Follow these steps to get Google Login working in your Mental Buddy app.

---

## Step 1: Get Your Google Client ID (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project named "Mental Buddy"
3. Go to APIs & Services → OAuth Consent Screen
   - Select "External" user type
   - Fill in app name and your email
   - Save
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Select "Web application"
6. Under "Authorized JavaScript origins", add:
   - `http://localhost:5173`
   - `http://localhost:3000`
7. Under "Authorized redirect URIs", add the same URLs
8. Click Create and **copy your Client ID**

---

## Step 2: Add Client ID to Your App (1 minute)

### Frontend (.env.local)
```
VITE_GOOGLE_CLIENT_ID=<paste-your-client-id-here>
```

Save at: `FRONT-END/.env.local`

### Backend (.env) - Optional
```
GOOGLE_CLIENT_ID=<paste-your-client-id-here>
```

---

## Step 3: Start Your App (1 minute)

### Terminal 1 - Backend
```bash
cd BACK-END
npm install
npm start
```

### Terminal 2 - Frontend
```bash
cd FRONT-END
npm install
npm run dev
```

---

## Step 4: Test It (2 minutes)

1. Open http://localhost:5173 in your browser
2. Go to Login page
3. Click "Continue with Google" button
4. Sign in with your Google account
5. You should see the home page!
6. Check localStorage - you should see a JWT token

---

## ✅ What Was Done For You

### Frontend Changes
- ✅ Login page now has Google Sign-In button
- ✅ Google script auto-loads and initializes
- ✅ Login function decodes Google JWT
- ✅ User info sent to backend
- ✅ JWT token stored in localStorage
- ✅ Automatic redirect to home page

### Backend Changes
- ✅ `/api/auth/google` endpoint ready
- ✅ Checks if user exists by googleId or email
- ✅ Creates new user if doesn't exist
- ✅ Returns JWT token
- ✅ User model supports googleId

### Database
- ✅ Google users stored with: name, email, googleId, createdAt
- ✅ No password needed for Google users

---

## 🎯 How It Works

```
User Clicks Google Button
       ↓
Google Sign-In Opens
       ↓
User Signs In
       ↓
Frontend Gets Google Token
       ↓
Frontend Decodes Token → Extract name, email, googleId
       ↓
Send to Backend POST /api/auth/google
       ↓
Backend Creates or Finds User
       ↓
Backend Returns JWT Token
       ↓
Frontend Stores Token in localStorage
       ↓
Frontend Redirects to /home
```

---

## 📁 Files Changed/Created

```
✅ FRONT-END/
   ✅ .env.local                    [NEW]
   ✅ src/pages/Login.jsx           [UPDATED]
   ✅ src/styles/login.css          [UPDATED]
   ✅ src/services/authService.js   [UPDATED]

✅ BACK-END/
   ✅ .env                          [UPDATED]
   ✅ routes/auth.routes.js         [READY - no changes needed]
   ✅ models/User.js                [READY - no changes needed]
   ✅ middleware/auth.middleware.js [READY - no changes needed]

📚 DOCUMENTATION/
   ✅ GOOGLE_OAUTH_SETUP.md         [DETAILED SETUP]
   ✅ GOOGLE_OAUTH_IMPLEMENTATION.md [FULL DETAILS]
   ✅ GOOGLE_OAUTH_CODE_REFERENCE.md [CODE SNIPPETS]
```

---

## 🐛 Troubleshooting

### Issue: Button not showing
**Solution:** 
- Check if VITE_GOOGLE_CLIENT_ID is correct
- Restart frontend server (npm run dev)
- Clear browser cache

### Issue: Can't sign in
**Solution:**
- Make sure localhost:5173 is added to Google Cloud authorized origins
- Check browser console for error messages
- Verify backend is running (npm start in BACK-END)

### Issue: User not created in database
**Solution:**
- Check MongoDB connection (inspect MONGO_URI in .env)
- Check backend logs for errors
- Test: curl -X POST http://localhost:5000/api/auth/google -H "Content-Type: application/json" -d '{"name":"Test","email":"test@gmail.com","googleId":"123"}'

---

## 🚀 Next Steps

- [ ] Get Google Client ID
- [ ] Add VITE_GOOGLE_CLIENT_ID to .env.local
- [ ] Start backend: npm start
- [ ] Start frontend: npm run dev
- [ ] Test on http://localhost:5173
- [ ] Try signing in with Google
- [ ] Verify JWT in localStorage
- [ ] Check user created in MongoDB

---

## 📞 Test Endpoints

### Test User Creation (using Postman or curl)

```bash
curl -X POST http://localhost:5000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@gmail.com", 
    "googleId": "102938475029384750928374"
  }'
```

**Expected Response:**
```json
{
  "msg": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "email": "jane@gmail.com"
  }
}
```

---

## Code Snippets

### Login.jsx - Key Parts

```javascript
// Google script loads automatically
useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  
  script.onload = () => {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleSignIn,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("google-signin-button")
    );
  };
}, []);

// Handles Google response
const handleGoogleSignIn = async (response) => {
  // Decode JWT
  const googleUser = decodeGoogleJWT(response.credential);
  
  // Send to backend
  const res = await axios.post("/api/auth/google", googleUser);
  
  // Save token
  localStorage.setItem("token", res.data.token);
  navigate("/home");
};
```

---

## Environment Variables

| Variable | File | Value |
|----------|------|-------|
| VITE_GOOGLE_CLIENT_ID | FRONT-END/.env.local | Your Google Client ID |
| GOOGLE_CLIENT_ID | BACK-END/.env | Your Google Client ID (optional) |

---

## ✨ Features Included

- ✅ Google Sign-In button on login page
- ✅ Automatic JWT generation for Google users
- ✅ User creation in MongoDB
- ✅ Token stored in localStorage
- ✅ Automatic redirect after login
- ✅ Error handling and messages
- ✅ No additional dependencies needed
- ✅ Works with existing auth middleware
- ✅ Supports both traditional and Google users

---

## 🔗 Resources

- [Google OAuth Documentation](https://developers.google.com/identity/gsi/web)
- [Google Cloud Console](https://console.cloud.google.com/)
- [JWT Documentation](https://jwt.io/)
- [MongoDB Connection String](https://docs.mongodb.com/manual/reference/connection-string/)

---

## Questions?

Refer to:
1. **GOOGLE_OAUTH_SETUP.md** - Detailed Google Cloud setup
2. **GOOGLE_OAUTH_IMPLEMENTATION.md** - Full technical details
3. **GOOGLE_OAUTH_CODE_REFERENCE.md** - Code snippets and examples

---

**Status:** ✅ Ready to go! Follow steps above and you'll be live in 5 minutes.
