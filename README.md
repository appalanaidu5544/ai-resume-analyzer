# AI Resume Analyzer & Job Matcher

An AI-powered full-stack web application that analyzes resumes, extracts skills, and suggests suitable job roles.

This project demonstrates modern **MERN stack development** with **AI integration** and **REST API architecture**.

---

## Features

### User Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes

### Resume Management

* Upload Resume (PDF)
* Resume storage
* View uploaded resumes
* Delete resumes

### AI Resume Analysis

* Extract resume text
* Identify key skills
* Generate resume score
* Suggest improvements

### Job Matching

* AI-based job recommendations
* Skill-based job suggestions

---

## Tech Stack

### Frontend

* React (Vite)
* Axios
* React Router
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### AI Integration

* OpenAI API

### Authentication

* JWT
* bcrypt

---

## Project Structure

```
AI-Resume-Analyzer
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   ├── uploads
│   └── server.js
│
├── frontend
│   ├── public
│   └── src
│       ├── components
│       ├── pages
│       ├── services
│       ├── context
│       └── utils
│
└── README.md
```

---

## Installation

### Clone Repository

```
git clone https://github.com/yourusername/AI-Resume-Analyzer.git
cd AI-Resume-Analyzer
```

---

## Backend Setup

```
cd backend
npm install
```

Create `.env`

```
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_api_key
FRONTEND_URL=http://localhost:5173
```

Run backend

```
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

## Frontend Setup

```
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## API Endpoints

### Auth

POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile

### Resume

POST /api/resume/upload
GET /api/resume
GET /api/resume/:id
DELETE /api/resume/:id

### AI

POST /api/ai/analyze
GET /api/ai/jobs/:resumeId

---

## Example Register Request

```
POST /api/auth/register
```

Body

```
{
"name": "Appalanaidu",
"email": "appu@test.com",
"password": "123456"
}
```

---

## Deployment

Frontend: Vercel
Backend: Render
Database: MongoDB Atlas

---

## Author

Appalanaidu Routhu
