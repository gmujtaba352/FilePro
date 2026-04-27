# FilePro Project Setup

You are a senior full-stack developer.

Your task is to set up a complete full-stack project called:

"FilePro – Client-Ready File Toolkit"

---

## 🎯 GOAL

Create a working project with:
- Frontend (React + Vite + Tailwind)
- Backend (Node.js + Express)

---

## 📁 REQUIRED STRUCTURE

filepro/
│
├── client/     → React frontend
├── server/     → Node backend
└── README.md

---

## 🚀 STEP 1: FRONTEND SETUP

Guide to:
1. Run command to create Vite React app:
   npm create vite@latest client

2. Select:
   - React
   - JavaScript

3. Install dependencies:
   cd client
   npm install

4. Run dev server:
   npm run dev

---

## 🎨 STEP 2: INSTALL TAILWIND

Inside client:
1. Install Tailwind CSS
2. Configure tailwind.config.js
3. Add Tailwind to index.css

---

## ⚙️ STEP 3: BACKEND SETUP

1. Create folder:
   mkdir server
   cd server

2. Initialize Node:
   npm init -y

3. Install dependencies:
   npm install express cors dotenv

---

## 🔧 STEP 4: CREATE SERVER

Create file:
server/index.js

Requirements:
- Use Express
- Enable CORS
- Use express.json()
- Create GET "/" route returning "API is running"
- Run on port 5000

---

## ⚙️ STEP 5: PACKAGE CONFIG

In server/package.json:
- Add "type": "module"

---

## 🧪 STEP 6: TEST

Frontend:
http://localhost:5173

Backend:
http://localhost:5000

---

## 📘 STEP 7: CREATE README

Create README.md with:
- Project description
- Setup steps
- Run instructions

---

## ⚠️ RULES

- Generate clean, working code
- Explain where each file goes
- Keep beginner-friendly
- Do not skip steps