# Team Task Manager

A full-stack, production-ready web application for managing projects and tasks, built with the MERN stack (MongoDB, Express, React, Node.js). 

## ✨ Features
- **Interactive Kanban Board**: Drag-and-drop tasks between columns (To Do, In Progress, Done) with real-time UI updates.
- **Fully Responsive UI**: Mobile-first design that adapts flawlessly across phones, tablets, and desktop monitors.
- **Premium Design**: Modern Glassmorphism aesthetic built with custom CSS, featuring fluid typography and curated color palettes.
- **User Authentication**: Secure signup and login with JWT stored securely in HTTP-only cookies.
- **Role-Based Access Control**: 
  - **Admin**: Can create projects, add/remove team members, create tasks, and manage all task details.
  - **Member**: Can view assigned projects and update the status of their assigned tasks via the drag-and-drop board.
- **Project & Task Management**: Generate unique Project IDs, assign priorities, set due dates, and track team progress.
- **Dashboard Analytics**: Get a birds-eye view of productivity with metrics like total tasks, overdue tasks, and status distribution.

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (local instance or Atlas URI)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Task_Management_System.git
   cd Task_Management_System
   ```

2. **Install all dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the `backend` folder:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. **Start the Development Servers**
   - Terminal 1 (Backend): `cd backend && npm run dev`
   - Terminal 2 (Frontend): `cd frontend && npm run dev`

## 🌍 Production Deployment (Railway)

This project is configured as a monorepo, meaning the backend automatically serves the built React frontend. It is highly optimized for easy deployment on [Railway.app](https://railway.app/).

1. Create a new project on Railway and select **Deploy from GitHub repo**.
2. Railway will automatically detect the root `package.json` and run the necessary `npm install` and `npm run build` commands.
3. Once deployed, go to the **Variables** tab of your Railway service and add:
   - `MONGODB_URI` (Your MongoDB Atlas connection string)
   - `NODE_ENV` (Set value to: `production`)
   - `JWT_SECRET` (A secure random string of your choice)
4. Go to the **Settings** tab and click **Generate Domain** to get your live, public URL!
