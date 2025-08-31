# Development Notes - Teacher Dashboard

## 🎯 Project Overview  
This Teacher Dashboard is a **desktop application** built with **Electron + React (TypeScript, TailwindCSS)** for the frontend and **Node.js + Express + SQLite (TypeScript)** for the backend. It provides secure authentication, student management (CRUD), and analytics in compliance with the given assignment requirements.

---

## 🧠 Approach & Thought Process  

1. **Requirement Analysis**  
   - Desktop app with backend integration  
   - JWT authentication with hardcoded credentials  
   - Student CRUD operations with validation  
   - Analytics: count, subject averages, and recent additions  

2. **Architecture**  
   - **Separated Backend & Frontend**: Express API and Electron app communicate via `http://localhost:3001`  
   - **Database**: SQLite chosen for lightweight, file-based storage (ideal for desktop apps)  
   - **Type Safety**: Used TypeScript consistently across frontend and backend  

3. **Development Flow**  
   - Built backend APIs first (authentication, students, analytics)  
   - Integrated frontend with API endpoints via custom hooks  
   - Implemented validation both client-side (Yup) and server-side (express-validator)  

---

## 🔧 Technical Decisions  

### Backend  
- **Express + SQLite + TypeScript**: Simple, maintainable, lightweight  
- **JWT Authentication**: Stateless and secure for protecting student routes  
- **Validation**: Database constraints + express-validator  
- **CORS**: Configured for Electron desktop environment  

**Database Schema**  
```sql
CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL CHECK(length(name) >= 2),
  email TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL CHECK(subject IN ('Math','Science','English','History')),
  grade INTEGER NOT NULL CHECK(grade >= 0 AND grade <= 100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Frontend  
- **Electron.js**: Packaged React app into a desktop app with fixed window size (1200x800, non-resizable)  
- **React + TypeScript**: Functional components with hooks  
- **TailwindCSS**: Fast and consistent styling  
- **State Management**: React Context for auth, custom hooks for API logic  
- **Form Handling**: `react-hook-form` + `Yup` validation  

---

## 🚧 Challenges & Solutions  

1. **Frontend-Backend Type Mismatch**  
   - **Solution**: Created shared TypeScript interfaces for consistency  

2. **Electron + React Workflow**  
   - **Solution**: Used `concurrently` + `wait-on` to sync React dev server with Electron  

3. **Database Connection Handling**  
   - **Solution**: Implemented a wrapper class with promise-based methods & singleton instance  

4. **Validation Duplication**  
   - **Solution**: Applied schemas on both frontend (Yup) & backend (express-validator)  

---

## 🎨 UI/UX Design  

- **Minimal, Clean Layout**: Focus on teacher productivity  
- **Components**:  
  - **Login**: Form with error feedback  
  - **StudentList**: Table view with search + subject filter  
  - **StudentForm**: Add/edit with validation  
  - **Analytics**: Count, subject averages, latest students  

- **Styling**: TailwindCSS for fast prototyping, consistent theme, and responsive layout  

---

## 📊 Performance & Security  

- **Backend**: Indexed queries, centralized error handling  
- **Frontend**: Memoization, code splitting, API caching  
- **Security**:  
  - JWT tokens with 24h expiry  
  - Parameterized queries (prevent SQL injection)  
  - Helmet middleware for secure headers  
  - Electron context isolation + disabled node integration  

---

## 🛠 Tools & Libraries  

- **Backend**: express, sqlite3, jsonwebtoken, express-validator, helmet, cors, morgan  
- **Frontend**: react, react-router-dom, axios, react-hook-form, yup, electron, tailwindcss  
- **Dev Tools**: typescript, ts-node-dev, concurrently, wait-on  

---

## 📈 Improvements If Given More Time  

- Add unit/integration tests (Jest, React Testing Library)  
- Database migrations for schema evolution  
- Enhanced analytics (charts, exports)  
- Role-based multi-user system  
- Offline-first support with caching  

---

## 📝 Assumptions  

1. Single teacher user only (per requirements)  
2. Local SQLite database bundled with the app  
3. Backend runs on `localhost:3001` inside the same machine  
4. Authentication via hardcoded credentials is sufficient for this context  
