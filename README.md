# Student Panel - School ERP (TypeScript)

## 📁 Structure
```
student-panel/
├── frontend/          # React + TypeScript frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── student/    # Student pages only
│   │   │   └── auth/       # 4 Auth pages ✅
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.tsx
│   ├── package.json
│   └── tsconfig.json
└── backend/           # Node.js + Express API
    └── (shared with admin panel)
```

## 🚀 Installation

### 1. Frontend Setup
```bash
cd student-panel/frontend
npm install
```

### 2. Backend Setup
```bash
cd ../backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URL
```

### 3. Start Backend
```bash
cd backend
npm start
# Runs on http://localhost:5000
```

### 4. Start Frontend
```bash
cd frontend
npm run dev
# Runs on http://localhost:3001
```

## 🔐 Login Methods (Dual)

### Method 1: Password Login
- GR Number: `GR2024001`
- Password: `student123`

### Method 2: PIN Login ⭐
- GR Number: `GR2024001`
- PIN: `1234` (4-digit)

## ✨ Features

### Student Features
- Personal Dashboard
- View Attendance
- View Homework
- Check Results
- Fee Status
- School Notices
- Leave Application
- Profile Management

### Authentication Pages (4)
1. **Login** - Dual method (Password/PIN)
2. **Forgot Password** - `/auth/forgot-password`
3. **Verify Email** - `/auth/verify-email`
4. **Change Password** - `/auth/change-password`

## 🎯 Special Feature: PIN Login
- Switch between Password/PIN tabs
- Large 4-digit PIN input
- Easy for students
- Same security as password

## 🎨 Original Theme Maintained
- Uses your original color scheme
- Primary colors preserved
- Tailwind CSS classes as-is

## 📝 TypeScript Features
- Full type safety
- .tsx file extensions
- React.FC types
- Type-safe API calls

## 🌐 Routes
- `/student/dashboard`
- `/student/attendance`
- `/student/homework`
- `/student/results`
- `/student/fees`
- `/student/notices`
- `/student/leave`
- `/student/profile`
