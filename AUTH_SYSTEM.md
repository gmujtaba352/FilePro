# Authentication System - FilePro

We now implement full authentication.

IMPORTANT:
Before writing code, review the existing backend and MongoDB connection.
Ensure everything is working correctly and consistent.

---

## FEATURES:

1. User Registration
- name
- email
- password (hashed)

2. User Login
- verify email/password
- return JWT token

3. Security
- bcrypt password hashing
- JWT authentication
- protected routes middleware

---

## FILE STRUCTURE:

models/User.js
controllers/authController.js
routes/authRoutes.js
middleware/authMiddleware.js

---

## RULES:

- Use async/await
- Use clean modular structure
- Handle errors properly
- Do NOT break existing DB connection
- Keep code production-ready

---

## OUTPUT REQUIRED:

- Full backend authentication system
- Route integration in server index.js
- Test instructions using Postman or browser