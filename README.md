# Teacher Dashboard - Desktop Application

A comprehensive Teacher Dashboard desktop application built with **Electron, React, TypeScript, TailwindCSS (frontend)** and **Node.js, Express, SQLite, TypeScript (backend)**.  
The application allows teachers to manage student records, perform CRUD operations, view analytics, and authenticate securely using JWT.

---

## 🚀 Features

### Backend (Express + TypeScript)
- **JWT Authentication** (hardcoded credentials)
- **SQLite Database** with students table
- **RESTful API** endpoints (CRUD + analytics)
- **Input Validation** with `express-validator`
- **Error Handling** middleware
- **CORS Support** for Electron integration

### Frontend (Electron + React + TypeScript)
- **Modern UI** with TailwindCSS
- **Authentication Flow** (login/logout)
- **Student Management** (CRUD)
- **Search & Filter** students by subject
- **Analytics Dashboard** with statistics
- **Form Validation** with `react-hook-form` + `Yup`
- **Loading States** & error handling
- **Fixed Window Size**: 1200x800 (non-resizable)

---

## 📋 Requirements Met

✅ **Backend Requirements**
- Express server with TypeScript  
- SQLite database with `students` table (`id, name, email, subject, grade, created_at`)  
- JWT authentication with hardcoded credentials (`teacher / password123`)  
- Full CRUD endpoints + analytics endpoint  
- Input validation and error handling  
- Runs on port `3001` with CORS enabled  

✅ **Frontend Requirements**
- Electron app with React + TypeScript  
- Login form with validation  
- Student list with search/filter  
- Add/Edit student form with validation  
- Analytics dashboard with statistics  
- Functional components + hooks  
- Custom API hooks and Auth Context  
- Window size 1200x800, not resizable  

---

## 🛠 Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)  
- **npm** (comes with Node)

---

### Running Locally

> ⚠️ **Requires two terminals** (one for frontend/Electron, one for backend server).

#### 1. Backend (Server)
```bash
cd server
npm install
npm run dev
```

#### 2. Frontend (Electron App)
```bash
cd electron-app
npm install
npm run build
npm run electron
```

---

## 🔧 Available Scripts

### Backend (`/server`)
- `npm run dev` → Start development server with hot reload  
- `npm run build` → Compile TypeScript to JavaScript  
- `npm start` → Start production server  

### Frontend (`/electron-app`)
- `npm run electron` → Run Electron app  
- `npm run electron-dev` → Run React dev server + Electron together  
- `npm run electron-build` → Build React + Electron  
- `npm run dist` → Create distributable desktop app  

---

## 🔐 Authentication

**Demo Credentials:**  
- Username: `teacher`  
- Password: `password123`  

Authentication uses **JWT tokens** with a **24-hour expiration**.  

---

## 📊 API Endpoints

### Authentication
- `POST /auth/login` → Login with username/password  

### Students
- `GET /students` → Fetch all students (with optional filters)  
- `POST /students` → Create new student  
- `PUT /students/:id` → Update student  
- `DELETE /students/:id` → Delete student  

### Analytics
- `GET /analytics` → Total count, subject averages, recent additions  

---

## 🎨 UI Components

- **Login Page** → Validated login form  
- **Student List** → Searchable/filterable table with edit/delete  
- **Student Form** → Add/Edit student with validation  
- **Analytics Dashboard** → Stats, averages, recent additions  

---

## 🔒 Security

- JWT-based auth with expiration  
- Input validation (client + server)  
- SQL injection prevention via parameterized queries  
- CORS enabled only for Electron app  
- Electron security (context isolation, no node integration in renderer)  

---

## 🚀 Deployment

### Development
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd electron-app && npm run electron
```

### Production
```bash
# Backend
cd server && npm run build

# Frontend
cd electron-app && npm run dist
```

---

## 📝 Future Enhancements
- Multiple teacher accounts with role-based access  
- Export data to PDF/Excel  
- Database migrations  
- Advanced analytics (charts, trends)  
- Dark/Light mode toggle  
- Offline support with caching  

---

## 📄 License
This project is licensed under the **ISC License**.  
