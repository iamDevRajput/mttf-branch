# Project Overview

This document provides a high-level overview of the Math Tech Foundation (MTTF) internship project repository.

## 🛠 Tech Stack

*   **Full Stack:** MERN (MongoDB, Express, React, Node.js)
*   **Styling:** Tailwind CSS
*   **Animations:** Framer Motion

### Frontend Framework
*   **React 19** powered by **Vite** for fast development and building.

### Backend Framework
*   **Node.js** with **Express.js** handling API requests and server-side logic.

### Database Used
*   **MongoDB** (Object modeling via **Mongoose**) for storing users and other application data.

## 📁 Folder Structure

The repository is organized into two main workspaces:

```text
internship-work/
├── frontend/               # React application
│   ├── public/             # Static assets
│   ├── src/                # Frontend source code
│   │   ├── assets/         # Images and icons
│   │   ├── Components/     # Reusable UI components (Navbars, Footers, Hero)
│   │   └── Pages/          # Application routes/pages (Auth, Programs, About)
│   ├── package.json        # Frontend dependencies & scripts
│   └── vite.config.js      # Vite configuration
│
└── backend/                # Node.js Express server
    ├── config/             # Database connection setup (db.js)
    ├── models/             # Mongoose schemas (User.js)
    ├── routes/             # API route handlers (auth.js)
    ├── server.js           # Express application entry point
    └── package.json        # Backend dependencies
```

## ✨ Main Features

Based on the application structure, the main features include:

*   **Authentication System:** Secure login and registration flows built with JWT and bcrypt.
*   **Consultancy Services Portal:** Information on Expert Consultancy, Logistic Support, and Conference Support.
*   **Research & Capabilities Showcase:** Pages dedicated to AI, Bioinformatics, Data Analytics, and Quantum Computing.
*   **Blogs Section:** Articles on Data Science, STEM Education, and Machine Learning.
*   **Foundation Ecosystem:** Information on MTTF structure, Advisors, Leadership, Student Chapters, and Institutional memberships.
*   **Awards Directory:** Showcases of past and upcoming awards (e.g., Awards 2024, Awards 2025).

## 🚀 How to Run Locally

To run this project on your local machine, you will need to start both the backend server and the frontend development server.

### 1. Backend Setup
Open a terminal and navigate to the backend directory:
```bash
cd backend
```
Install the dependencies:
```bash
npm install
```
Set up your environment variables:
*   Create a `.env` file in the `backend/` directory.
*   Add your MongoDB connection string and a secret key, for example:
    ```env
    PORT=8000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```
Start the server:
```bash
npx nodemon server.js
# The API will run at http://localhost:8000
```

### 2. Frontend Setup
Open a new terminal window/tab and navigate to the frontend directory:
```bash
cd frontend
```
Install the dependencies:
```bash
npm install
```
Start the Vite development server:
```bash
npm run dev
```
Open your browser and visit the local server, typically running at **`http://localhost:5173`**.
