import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth Pages
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import ChangePassword from './pages/auth/ChangePassword';

// Layouts
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
// import FCMManager from './components/FCMManager';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentHomework from './pages/student/StudentHomework';
import StudentExams from './pages/student/StudentExams';
import StudentResults from './pages/student/StudentResults';
import StudentFees from './pages/student/StudentFees';
import StudentNotices from './pages/student/StudentNotices';
import StudentLeave from './pages/student/StudentLeave';
import StudentTimetable from './pages/student/StudentTimetable';
import StudentHolidayCalendar from './pages/student/StudentHolidayCalendar';

// Common
import Profile from './pages/Profile';

import 'react-toastify/dist/ReactToastify.css';

const PrivateRoute: React.FC<any> = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const DashboardLayout: React.FC<any> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = React.useState<boolean>(false);
  const toggleSidebar = () => setIsOpen(prev => !prev);

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      <div className="hidden md:flex flex-shrink-0 h-full">
        <Sidebar 
          isOpen={isOpen} 
          toggleSidebar={toggleSidebar} 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
        />
      </div>
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <div className="hidden md:block">
          <Header toggleSidebar={toggleSidebar} />
        </div>
        <main className="flex-1 overflow-y-auto bg-gray-100 w-full pb-16 md:pb-0">
          <div className="w-full">
            {children}
          </div>
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
};

function AppContent() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/student/dashboard" replace />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/verify-email" element={<VerifyEmail />} />
      <Route path="/auth/change-password" element={<ChangePassword />} />

      {/* Student Routes */}
      <Route path="/student/dashboard" element={<PrivateRoute><DashboardLayout><StudentDashboard /></DashboardLayout></PrivateRoute>} />
      <Route path="/student/attendance" element={<PrivateRoute><DashboardLayout><StudentAttendance /></DashboardLayout></PrivateRoute>} />
      <Route path="/student/homework" element={<PrivateRoute><DashboardLayout><StudentHomework /></DashboardLayout></PrivateRoute>} />
      <Route path="/student/exams" element={<PrivateRoute><DashboardLayout><StudentExams /></DashboardLayout></PrivateRoute>} />
      <Route path="/student/results" element={<PrivateRoute><DashboardLayout><StudentResults /></DashboardLayout></PrivateRoute>} />
      <Route path="/student/fees" element={<PrivateRoute><DashboardLayout><StudentFees /></DashboardLayout></PrivateRoute>} />
      <Route path="/student/timetable" element={<PrivateRoute><DashboardLayout><StudentTimetable /></DashboardLayout></PrivateRoute>} />
      <Route path="/student/notices" element={<PrivateRoute><DashboardLayout><StudentNotices /></DashboardLayout></PrivateRoute>} />
      <Route path="/student/holidays" element={<PrivateRoute><DashboardLayout><StudentHolidayCalendar /></DashboardLayout></PrivateRoute>} />
      <Route path="/student/leave" element={<PrivateRoute><DashboardLayout><StudentLeave /></DashboardLayout></PrivateRoute>} />
      <Route path="/student/profile" element={<PrivateRoute><DashboardLayout><Profile /></DashboardLayout></PrivateRoute>} />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          style={{ zIndex: 99999 }}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
