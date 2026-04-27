# Authentication Setup – FilePro

You are a senior full-stack developer.

Project: FilePro – Client-Ready File Toolkit

-----------------------------------
CONTEXT:

We have already completed:

✔ Frontend:
- React (Vite)
- Tailwind CSS installed
- App running on localhost

✔ Backend:
- Node.js + Express server
- CORS enabled
- Basic route working

-----------------------------------

## ⚠️ IMPORTANT TASK

Before writing any new code:
👉 Review all existing structure and ensure everything is correct, consistent, and production-ready.
👉 Do not break existing code.

-----------------------------------

## 🎯 GOAL

Implement authentication system:

### Backend:
- MongoDB connection
- User model (name, email, password)
- Password hashing (bcrypt)
- JWT token generation
- Routes:
  - POST /api/auth/register
  - POST /api/auth/login

### Frontend:
- Signup page
- Login page
- API integration
- Store JWT token in localStorage
- Redirect after login

-----------------------------------

## 📁 STRUCTURE REQUIRED

server/
├── models/User.js
├── routes/authRoutes.js
├── controllers/authController.js
├── config/db.js

-----------------------------------

## ⚠️ RULES

- Use clean modular structure
- Use async/await
- Handle errors properly
- Explain where each file goes
- Keep code beginner-friendly

-----------------------------------

## OUTPUT:

1. Backend code (all files)
2. Frontend pages (login/signup)
3. API integration
4. Instructions to test everything

-----------------------------------

Make sure everything works together without breaking previous setup.