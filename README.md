# FilePro – Client-Ready File Toolkit

FilePro is a beginner-friendly full-stack starter for a SaaS file toolkit.
It includes a React frontend and an Express backend.

## Project Structure

```text
filepro/
├── client/   # React frontend
├── server/   # Node.js backend
└── README.md
```

## Frontend Setup

Inside `client`:

```bash
cd client
npm install
npm run dev
```

Frontend runs on http://localhost:5173

## Backend Setup

Inside `server`:

```bash
cd server
npm install
npm run dev
```

Backend runs on http://localhost:5000

## What You Get

- React app created with Vite
- Tailwind CSS configured
- Express server with CORS and JSON support
- A simple API route at `/` that returns `API is running`

## File Locations

- `client/index.html` - Vite HTML entry
- `client/src/main.jsx` - React entry file
- `client/src/App.jsx` - Frontend homepage
- `client/src/index.css` - Tailwind CSS entry
- `client/tailwind.config.js` - Tailwind configuration
- `client/postcss.config.js` - PostCSS configuration
- `client/vite.config.js` - Vite configuration
- `server/index.js` - Express server
- `server/package.json` - Backend package config

## Notes

If you want to expand this starter later, you can add file upload, authentication, or database integration on top of this base.
