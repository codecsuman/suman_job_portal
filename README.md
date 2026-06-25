<div align="center">

<br/>

```
 ██╗ ██████╗ ██████╗     ██████╗  ██████╗ ██████╗ ████████╗ █████╗ ██╗
 ██║██╔═══██╗██╔══██╗    ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔══██╗██║
 ██║██║   ██║██████╔╝    ██████╔╝██║   ██║██████╔╝   ██║   ███████║██║
██╗██║██║   ██║██╔══██╗    ██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══██║██║
╚████╔╝╚██████╔╝██████╔╝    ██║     ╚██████╔╝██║  ██║   ██║   ██║  ██║███████╗
 ╚═══╝  ╚═════╝ ╚═════╝     ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝
```

### *Where talent meets opportunity — built on the MERN Stack*

<br/>

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Visit%20App-6366f1?style=for-the-badge&logoColor=white)](https://suman-job-portal.vercel.app/)
[![Backend API](https://img.shields.io/badge/⚙️%20Backend%20API-Render-10b981?style=for-the-badge)](https://suman-job-portal.onrender.com)
[![GitHub Repo](https://img.shields.io/badge/📂%20GitHub-Repository-1f2937?style=for-the-badge&logo=github)](https://github.com/codecsuman/suman_job_portal)
[![Portfolio](https://img.shields.io/badge/👨‍💻%20Portfolio-sumanjhanp.netlify.app-f59e0b?style=for-the-badge)](https://sumanjhanp.netlify.app)

<br/>

![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=black)

</div>

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Future Enhancements](#-future-enhancements)
- [Author](#-author)

---

## 🎯 About the Project

**Job Portal** is a full-stack web application that bridges the gap between **job seekers** and **recruiters** on a unified platform. It provides a clean, modern interface for candidates to discover and apply for opportunities, while giving recruiters powerful tools to post jobs, manage listings, and review applicant profiles — all in real time.

> Built as a portfolio project to demonstrate end-to-end MERN Stack development skills, including REST API design, JWT authentication, cloud media storage, and production deployment.

<br/>

<div align="center">

| 👨‍💻 For Job Seekers | 🏢 For Recruiters |
|:---:|:---:|
| Search & apply for jobs | Post & manage job listings |
| Build your profile | Review all applicants |
| Track application status | Create & manage companies |
| Browse latest opportunities | Recruiter dashboard |

</div>

---

## ✨ Features

### 👨‍💻 Job Seeker
| Feature | Description |
|---|---|
| 🔐 **Secure Auth** | Registration & Login with JWT-protected sessions |
| 👤 **Profile Management** | Create and update personal profile with photo upload |
| 🔍 **Smart Job Search** | Filter jobs by title, company, and location |
| 📨 **Instant Apply** | One-click application submission |
| 📋 **Application Tracker** | View all jobs you've applied to |
| 📱 **Responsive UI** | Seamless experience on all screen sizes |

### 🏢 Recruiter / Admin
| Feature | Description |
|---|---|
| 🏢 **Company Management** | Create and manage your organization profile |
| ➕ **Post Jobs** | Add new openings with rich job details |
| ✏️ **Edit & Delete** | Full CRUD control over job listings |
| 👀 **Applicant Review** | View and manage all applicants per job |
| 📊 **Recruiter Dashboard** | Centralized control panel for all activities |

### ⚙️ General
- 🔒 JWT Authentication & Role-based Authorization
- 🛡️ Protected Routes for secure page access
- 🌐 RESTful API architecture
- ☁️ Cloudinary integration for file/image uploads
- 🔔 Toast Notifications for real-time feedback
- 🗄️ MongoDB Atlas cloud database

---

## 🛠️ Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                      FULL STACK OVERVIEW                    │
├─────────────────┬───────────────────────────────────────────┤
│  Frontend       │  React.js · Vite · Tailwind CSS · Axios   │
│  Backend        │  Node.js · Express.js                     │
│  Database       │  MongoDB Atlas · Mongoose ODM             │
│  Auth           │  JSON Web Tokens (JWT) · bcrypt.js        │
│  File Upload    │  Multer · Cloudinary                      │
│  Deployment     │  Vercel (FE) · Render (BE)                │
│  Version Ctrl   │  Git & GitHub                             │
└─────────────────┴───────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
suman_job_portal/
│
├── 📂 frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route-level page components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── store/             # Redux state management
│   │   └── utils/             # Helper utilities
│   ├── public/
│   └── package.json
│
├── 📂 backend/
│   ├── controllers/           # Route handler logic
│   ├── middleware/             # Auth & error middleware
│   ├── models/                # Mongoose data models
│   ├── routes/                # Express API routes
│   ├── utils/                 # Utility functions
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

```bash
node --version   # v18+ recommended
npm --version    # v9+
```

You'll also need accounts for:
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) — cloud database
- [Cloudinary](https://cloudinary.com) — file/image hosting

---

### 1. Clone the Repository

```bash
git clone https://github.com/codecsuman/suman_job_portal.git
cd suman_job_portal
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `/backend` directory (see [Environment Variables](#-environment-variables) below), then:

```bash
npm run dev
# Server running at http://localhost:8000
```

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
# App running at http://localhost:5173
```

---

## 🔑 Environment Variables

### Backend — `/backend/.env`

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=https://suman-job-portal.vercel.app
```

### Frontend — `/frontend/.env.production`

```env
VITE_API_URL=https://suman-job-portal.onrender.com/api/v1
```

> ⚠️ **Never commit `.env` files to version control.** Add them to `.gitignore`.

---

## ☁️ Deployment

| Layer | Platform | URL |
|---|---|---|
| 🌐 Frontend | [Vercel](https://vercel.com) | [suman-job-portal.vercel.app](https://suman-job-portal.vercel.app/) |
| ⚙️ Backend | [Render](https://render.com) | [suman-job-portal.onrender.com](https://suman-job-portal.onrender.com) |
| 🗄️ Database | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | Cloud-hosted cluster |
| 🖼️ Media | [Cloudinary](https://cloudinary.com) | CDN-backed image hosting |

---

## 🔮 Future Enhancements

- [ ] 📄 Resume Upload & Parsing
- [ ] 📧 Email Notifications for applications
- [ ] 🗓️ Interview Scheduling System
- [ ] 💬 In-app Chat — Recruiters ↔ Applicants
- [ ] 🌙 Dark Mode Toggle
- [ ] 🤖 AI-powered Job Recommendations
- [ ] 🔖 Save / Bookmark Jobs
- [ ] ✅ Company Verification Badge
- [ ] 📊 Admin Analytics Dashboard

---

## 👨‍💻 Author

<div align="center">

<br/>

**Suman Jhanp**

*MERN Stack Developer | Full-Stack Enthusiast*

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-codecsuman-1f2937?style=for-the-badge&logo=github)](https://github.com/codecsuman)
[![Portfolio](https://img.shields.io/badge/Portfolio-sumanjhanp.netlify.app-f59e0b?style=for-the-badge&logo=netlify)](https://sumanjhanp.netlify.app)

</div>

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add: your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

<br/>

If this project helped you or sparked an idea — drop a ⭐ on the repo. It means a lot!

<br/>

**Made with ❤️ by [Suman Jhanp](https://sumanjhanp.netlify.app)**

*Happy Coding 🚀*

</div>
