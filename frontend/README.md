# AI Resume Analyzer Frontend

Frontend application for the AI Resume Analyzer project built using **React and Vite**.

This interface allows users to register, upload resumes, view AI analysis results, and receive job recommendations.

---

## Tech Stack

* React (Vite)
* React Router
* Axios
* CSS

---

## Features

* User Registration
* User Login
* Resume Upload UI
* Dashboard
* Resume Analysis Results
* Job Suggestions

---

## Project Structure

```
src
│
├── components
│   ├── Navbar.jsx
│   ├── ResumeUpload.jsx
│   ├── ResumeCard.jsx
│   └── JobSuggestions.jsx
│
├── pages
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   └── ResumeAnalysis.jsx
│
├── services
│   └── api.js
│
├── context
│   └── AuthContext.jsx
│
├── utils
│   └── auth.js
│
├── App.jsx
└── main.jsx
```

---

## Installation

```
npm install
```

Run development server

```
npm run dev
```

Application runs on

```
http://localhost:5173
```

---

## Environment Variables

Create `.env`

```
VITE_API_URL=http://localhost:5000/api
```

---

## API Integration

Axios instance is configured in

```
src/services/api.js
```

Example

```
export const registerUser = (data) => api.post('/auth/register', data);
```

---

## Author

Appalanaidu Routhu
