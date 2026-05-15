# Team Task Manager

A full-stack web application for managing projects and tasks, built with the MERN stack (MongoDB, Express, React, Node.js).

## Features
- **User Authentication**: Secure signup and login with JWT stored in HTTP-only cookies.
- **Role-Based Access**: 
  - **Admin**: Can create projects, add members, create tasks, and manage all task details.
  - **Member**: Can view projects they belong to and update the status of tasks assigned to them.
- **Project Management**: Create projects and manage team members.
- **Task Management**: Create tasks with priorities, due dates, and statuses (To Do, In Progress, Done).
- **Dashboard**: View key metrics including total tasks, overdue tasks, and task distribution.
- **Premium Design**: Modern Glassmorphism UI built with Vanilla CSS.

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (local instance or Atlas URI)

### Local Development

1. **Clone the repository**
2. **Install all dependencies**
   ```bash
   npm install
   ```
3. **Configure Environment Variables**
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:5173
   ```
4. **Start the Development Servers**
   - Terminal 1 (Backend): `cd backend && npm run dev` (Ensure nodemon is installed)
   - Terminal 2 (Frontend): `cd frontend && npm run dev`

### Deployment (Railway)

This project is configured as a monorepo for easy deployment on Railway.

1. Create a new project on [Railway](https://railway.app/).
2. Add a **MongoDB** plugin to your project.
3. Connect your GitHub repository to the project.
4. Railway will automatically detect the root `package.json` and run the `install` and `build` scripts.
5. **Set Environment Variables in Railway**:
   - `MONGODB_URI` (Use the internal connection string provided by the Railway MongoDB plugin)
   - `JWT_SECRET` (Generate a secure random string)
   - `PORT` (Optional, Railway sets this automatically)
6. Railway will run the `npm start` script which starts the backend server and serves the built React frontend.
