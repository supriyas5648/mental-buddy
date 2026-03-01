# 🚀 Quick Start Guide - Mental Buddy Authentication

## Prerequisites
- Node.js installed
- MongoDB Atlas account with connection string in `.env`
- JWT_SECRET set in `.env`

---

## Setup Instructions

### 1. Backend Setup

```bash
# Navigate to backend folder
cd BACK-END

# Install dependencies (if not already done)
npm install

# Create .env file with:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key_here
# PORT=5000
# NODE_ENV=development

# Start backend server
npm start
# Should output: "Server running on 5000" and "MongoDB connected"
```

### 2. Frontend Setup

```bash
# Navigate to frontend folder
cd FRONT-END

# Install dependencies (if not already done)
npm install

# Start frontend development server
npm run dev
# Should output: "VITE v... local: http://localhost:5173"
```

### 3. Test in Browser

Open `http://localhost:5173` and you should see the Login page.

---

## Testing Workflow

### ✅ Test 1: Create New User (Signup)

1. Click "Sign up" link on login page
2. Fill in form:
   - **Name:** John Doe
   - **Email:** john@example.com
   - **Password:** password123
   - **Confirm Password:** password123
3. Click "Sign Up" button
4. ✅ Should redirect to **Home page** (`/home`)
5. Check browser console → Should show authentication tokens

### ✅ Test 2: Login with Existing User

1. You're now on Home page, logout first (clear localStorage)
   - Open DevTools → Application → LocalStorage → Delete "token"
   - Navigate back to `http://localhost:5173`

2. Fill login form:
   - **Email:** john@example.com
   - **Password:** password123
3. Click "Sign in" button
4. ✅ Should redirect to **Home page** (`/home`)

### ✅ Test 3: Test Protected Routes

1. Manually delete token from localStorage
2. Navigate to `http://localhost:5173/home`
3. ✅ Should redirect back to login page

### ✅ Test 4: Test Signup Validation

Try these scenarios to see error messages:

```
Test Case 1: Empty fields
- Leave any field blank → Click Sign Up
- Should show: "All fields are required"

Test Case 2: Mismatched passwords
- Name: Test
- Email: test@test.com
- Password: password123
- Confirm: different123
- Should show: "Passwords do not match"

Test Case 3: Weak password
- Name: Test
- Email: test@test.com
- Password: 123
- Confirm: 123
- Should show: "Password must be at least 6 characters"

Test Case 4: Invalid email
- Name: Test
- Email: notemail
- Password: password123
- Confirm: password123
- Should show: "Please enter a valid email"

Test Case 5: Email already registered
- Use same email as before
- Should show: "Email already registered"
```

---

## Useful Commands

```bash
# Kill server if stuck
# On Windows PowerShell:
Get-Process node | Stop-Process -Force

# View live logs
npm start --verbose

# Check MongoDB connection
# Add this to server.js:
console.log("MongoDB URI:", process.env.MONGO_URI);
```

---

## Key Features Implemented

| Feature | Location | Status |
|---------|----------|--------|
| User signup with validation | `/api/auth/signup` | ✅ |
| User login | `/api/auth/login` | ✅ |
| Password hashing (bcrypt) | `User.js`, `routes/auth.routes.js` | ✅ |
| JWT token generation | `routes/auth.routes.js` | ✅ |
| Protected routes | `ProtectedRoute.jsx` | ✅ |
| Token storage | `Login.jsx`, `Signup.jsx` | ✅ |
| Error handling | All routes & pages | ✅ |
| Signup form | `Signup.jsx` | ✅ |
| Updated login form | `Login.jsx` | ✅ |
| Auth service | `authService.js` | ✅ |
| Navigation | `App.jsx` | ✅ |

---

## Environment Variables Checklist

- [ ] Created `.env` file in `BACK-END` folder
- [ ] Set `MONGO_URI` with your MongoDB connection string
- [ ] Set `JWT_SECRET` to a random string
- [ ] Set `PORT` to 5000 (or your preferred port)
- [ ] Set `NODE_ENV` to development
- [ ] (optional) Configure SMTP settings for email notifications:
  - `EMAIL_HOST` (e.g. smtp.gmail.com)
  - `EMAIL_PORT` (e.g. 587)
  - `EMAIL_USER` and `EMAIL_PASS` (credentials for SMTP account)
  - `EMAIL_FROM` (address used in the From header)
  - `ADMIN_NOTIFICATION_EMAIL` (optional admin address to receive signup alerts)

---

## What's Next?

### Short term:
1. Test all features above
2. Integrate other pages (Chat, Profile, Progress, Mood)
3. Add logout button to pages
4. Update existing API routes to use auth middleware

### Medium term:
1. Implement email verification on signup (we now send a welcome/notification email)
2. Add password reset feature
3. Improve error messages with toast notifications
4. Add loading spinners during auth operations

### Long term:
1. Implement refresh tokens
2. Add social login (Google, GitHub)
3. Implement two-factor authentication
4. Add activity logging
5. Implement role-based access control

---

## Troubleshooting

### Backend won't start
```
Error: Cannot find module 'bcrypt'
→ Run: npm install in BACK-END folder

Error: EADDRINUSE: address already in use
→ Kill process: Get-Process node | Stop-Process -Force
→ Or change PORT in .env
```

### Frontend won't start
```
Error: Cannot find module 'axios'
→ Run: npm install in FRONT-END folder

Port 5173 is already in use
→ Kill process or use different port
```

### Login/Signup API errors
```
500 error
→ Check backend console for detailed error
→ Verify MONGO_URI in .env
→ Verify JWT_SECRET in .env

401 error
→ Check if token is being sent correctly
→ Clear token from localStorage and try again

CORS error
→ Verify frontend makes requests to http://localhost:5000
→ Check if backend CORS is enabled (should be in server.js)
```

---

## API Endpoints Reference

```
POST /api/auth/signup
├─ Body: { name, email, password, confirmPassword }
├─ Response: { msg, token, user }
└─ Status: 201 (success), 400 (validation), 409 (exists), 500 (error)

POST /api/auth/login
├─ Body: { email, password }
├─ Response: { msg, token, user }
└─ Status: 200 (success), 400 (required), 401 (invalid), 500 (error)
```

---

**You're all set! Happy coding! 🎉**
