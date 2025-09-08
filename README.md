---
# Task Manager App

A full-stack **Task Manager application** built with **MERN stack** + **Vite + Tailwind CSS**.
Implements task tracking with authentication and a Kanban board.
---

## Features

- User authentication (signup/login with JWT)
- Create, update, delete tasks
- Move tasks between statuses: **To Do, In Progress, Done**
- RESTful API with controllers, models, routes
- Responsive UI with Tailwind
- Deployed easily on cloud platforms (Render, Vercel)

---

## Tech Stack

**Frontend**

- React 18 + Vite
- Tailwind CSS
- Axios, React Router

**Backend**

- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Controllers / Models / Routes architecture

---

## Project Structure

project-root/
├── backend/
│ ├── controllers/ # task & auth controllers
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API routes
│ ├── middleware/ # auth middleware
│ ├── server.js
│ └── .env
├── frontend/
│ └── (React + Vite app)
├── package.json
└── README.md
