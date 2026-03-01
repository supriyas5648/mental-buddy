# Mental Buddy - Authentication System Implementation Guide

## 📋 Overview

This guide explains the complete authentication system implementation for the Mental Buddy MERN stack application, including user signup, login, and route protection.

---

## 🔧 Backend Implementation

### 1. **User Model** (`BACK-END/models/User.js`)

The User model handles user data management with MongoDB:

```javascript
// Fields:
- name (string, required)
- email (string, required, unique)
- password (string, required, hashed with bcrypt)
- createdAt (date, auto-set)

// Methods:
- create(db, user) → Hash password + save to MongoDB
- findByEmail(db, email) → Find user by email
- findById(db, userId) → Find user by MongoDB ID
```

**Key Points:**
- Passwords are NEVER stored in plain text
- Bcrypt hashing with 10 salt rounds for security
- MongoDB ObjectId used for user identification

---

### 2. **Authentication Routes** (`BACK-END/routes/auth.routes.js`)

> **New feature:** whenever a user successfully signs up the backend will send a welcome email to the provided address. If `ADMIN_NOTIFICATION_EMAIL` is configured an alert is also sent to the administrator.


#### **POST /api/auth/signup**

Register a new user:

```javascript
Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}

Response (201 Created):
{
  "msg": "User created successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}

Error Responses:
- 400: Missing fields, password mismatch, weak password, invalid email
- 409: Email already registered
- 500: Server error
```

**Validation Steps:**
1. ✅ All fields required
2. ✅ Passwords match
3. ✅ Password ≥ 6 characters
4. ✅ Valid email format
5. ✅ Email not already registered
6. ✅ Hash password + save user
7. ✅ Generate JWT token (expires in 7 days)

---

#### **POST /api/auth/login**

Authenticate existing user:

```javascript
Request Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response (200 OK):
{
  "msg": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}

Error Responses:
- 400: Missing email/password
- 401: Invalid email or password
- 500: Server error
```

**Authentication Steps:**
1. ✅ Validate required fields
2. ✅ Find user by email
3. ✅ Compare hashed password using bcrypt
4. ✅ Generate JWT token if valid
5. ✅ Return token and user info

---

### 3. **Auth Middleware** (`BACK-END/middleware/auth.middleware.js`)

Protects routes that require authentication:

```javascript
// Usage in routes:
const authMiddleware = require("../middleware/auth.middleware");
router.get("/protected-route", authMiddleware, (req, res) => {
  // req.user contains { userId: "..." }
});

// Client must send:
// Authorization: Bearer <JWT_TOKEN>
```

---

### 4. **Environment Variables** (`.env`)

```
# MongoDB Connection URI
MONGO_URI=your_mongodb_connection_string

# JWT Secret Key (change this in production!)
JWT_SECRET=your_random_secret_key_here

# Server Port
PORT=5000

# Environment
NODE_ENV=development
```

⚠️ **IMPORTANT:** Change JWT_SECRET to a strong random string in production!

---

### 5. **Database Connection** (`BACK-END/db.js`)

```javascript
// Establishes single MongoDB connection
// Reuses connection across requests (connection pooling)
// Called in server.js with proper error handling

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("mentalBuddyDB");
    console.log("MongoDB connected");
  }
  return db;
}
```

---

## 🎨 Frontend Implementation

### 1. **Login Page** (`FRONT-END/src/pages/Login.jsx`)

Updated login form with:
- Email & password inputs
- Real API calls to backend
- Error message display
- Loading state while submitting
- "Sign up" link to redirect to signup page
- Token stored in localStorage

**Flow:**
1. User enters credentials
2. POST to `/api/auth/login`
3. Receive JWT token
4. Save token to localStorage
5. Redirect to `/home`

---

### 2. **Signup Page** (`FRONT-END/src/pages/Signup.jsx`)

> **Note:** the backend now sends notification emails after successful registration (requires SMTP variables in `.env`).

New registration form with:
- Name, email, password, confirm password inputs
- Real-time validation feedback
- Error message display
- Loading state while submitting
- "Sign in" link to redirect to login
- Token stored in localStorage
- Auto-redirect after successful signup

**Flow:**
1. User fills signup form
2. POST to `/api/auth/signup`
3. Backend validates and creates user
4. Receive JWT token
5. Save token to localStorage
6. Redirect to `/home`

---

### 3. **Protected Route Component** (`FRONT-END/src/components/ProtectedRoute.jsx`)

Wrapper component to protect routes:

```javascript
// Usage in App.jsx:
<Route path="/home" element={<ProtectedRoute element={<Home />} />} />

// If no token → Redirect to login "/"
// If token exists → Allow access to page
```

**Security:**
- Checks for valid token in localStorage
- Redirects unauthenticated users to login
- Can be enhanced with token expiration checks

---

### 4. **Auth Service** (`FRONT-END/src/services/authService.js`)

Centralized authentication API client with:

```javascript
// Functions available:
signup(name, email, password, confirmPassword) → Create account
login(email, password) → Login user
logout() → Clear token & redirect
getUser() → Get stored user data
isAuthenticated() → Check if logged in
getToken() → Get stored JWT token

// Features:
✅ Axios instance with baseURL
✅ Auto-add token to request headers
✅ Auto-logout on 401 errors
✅ Centralized error handling
```

---

### 5. **Updated App Routes** (`FRONT-END/src/App.jsx`)

```javascript
// PUBLIC ROUTES (No authentication required)
/ → Login page
/signup → Signup page

// PROTECTED ROUTES (Requires valid token)
/home → Home page
/profile → User profile
/chat → Chat page
/mood → Mood entry
/progress → Progress tracking
```

---

## 🔐 Security Features

### Backend Security:
- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens with 7-day expiration
- ✅ Input validation on all fields
- ✅ Email uniqueness constraint
- ✅ Password strength requirements (6+ chars)
- ✅ Proper HTTP status codes
- ✅ Error messages don't leak information

### Frontend Security:
- ✅ Tokens stored in localStorage
- ✅ Protected routes require authentication
- ✅ Auto-logout on token expiration
- ✅ Axios interceptors for token management
- ✅ Validation before API calls

⚠️ **To Improve Security:**
1. Use httpOnly cookies instead of localStorage
2. Implement token refresh mechanism
3. Add CSRF protection
4. Use HTTPS in production
5. Add rate limiting to auth routes
6. Implement strong password requirements

---

## 🧪 Testing the Implementation

### 1. Test Signup:
```bash
# Start backend (BACK-END folder)
npm start

# Start frontend (FRONT-END folder)
npm run dev

# Open browser: http://localhost:5173
# Click "Sign up"
# Fill form: name, email, password
# Submit → Should redirect to /home
```

### 2. Test Login:
```bash
# Navigate to http://localhost:5173 (Login page)
# Enter the email and password you signed up with
# Submit → Should redirect to /home
```

### 3. Test Protected Routes:
```bash
# Open DevTools → Application → LocalStorage
# Delete the "token" key
# Manually navigate to http://localhost:5173/home
# Should redirect back to login page
```

### 4. Test with cURL (Backend):
```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 📁 File Structure

```
BACK-END/
├── models/
│   └── User.js (Updated with validation & findById)
├── routes/
│   └── auth.routes.js (Updated with signup & improved login)
├── middleware/
│   └── auth.middleware.js (Ready to use)
├── db.js (Handles MongoDB connection)
├── server.js (Connects to DB on startup)
└── .env (Add JWT_SECRET here)

FRONT-END/
├── src/
│   ├── pages/
│   │   ├── Login.jsx (Updated)
│   │   └── Signup.jsx (New)
│   ├── components/
│   │   └── ProtectedRoute.jsx (New)
│   ├── services/
│   │   ├── authService.js (New - Recommended)
│   │   └── api.js (Existing)
│   └── styles/
│       └── signup.css (New)
└── App.jsx (Updated with routes)
```

---

## 🚀 Next Steps

1. **Update other components** to use `authService` for API calls
2. **Add auth middleware** to protected backend routes:
   ```javascript
   const authMiddleware = require("../middleware/auth.middleware");
   router.post("/protected", authMiddleware, (req, res) => {...});
   ```
3. **Implement logout functionality** - Add button to clear token
4. **Add password reset feature** - Email-based reset flow
5. **Implement refresh tokens** - For better security
6. **Add role-based access control** - Admin/user roles
7. **Set up email verification** - Confirm email on signup

---

## 📝 Common Issues & Solutions

### Issue: "JWT_SECRET is undefined"
**Solution:** Add JWT_SECRET to .env file and restart server

### Issue: "CORS error in frontend"
**Solution:** Ensure backend is running on port 5000 and frontend makes requests to `http://localhost:5000`

### Issue: "Token not being sent to backend"
**Solution:** Use authService functions instead of direct axios calls, or manually add Authorization header

### Issue: "Protected routes show login page"
**Solution:** Make sure token is saved in localStorage after signup/login

---

## 📚 Additional Resources

- [JWT.io](https://jwt.io) - JWT documentation
- [Bcrypt npm package](https://www.npmjs.com/package/bcrypt) - Password hashing
- [Mongoose vs native MongoDB driver](https://stackoverflow.com/questions/54629309/) - Database patterns
- [React Router v6 Guide](https://reactrouter.com/en/main) - Advanced routing

---

**Happy coding! 🚀**
