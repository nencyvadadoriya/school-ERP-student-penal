import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, Users, Calendar, Wallet, Menu, X, 
  BookOpen, ClipboardList, Award, FileText, 
  Clock, ShieldAlert, LogOut, UserCircle,
  LayoutDashboard, Bell, PartyPopper, CalendarDays,
  Grid3X3, User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FaUser } from 'react-icons/fa';

const theme = {
  primary: '#002B5B',
  secondary: '#2D54A8',
};

const iconColors = [
  { bg: '#F8FAFC', color: '#002B5B' },
  { bg: '#F8FAFC', color: '#002B5B' },
  { bg: '#F8FAFC', color: '#002B5B' },
  { bg: '#F8FAFC', color: '#002B5B' },
  { bg: '#F8FAFC', color: '#002B5B' },
  { bg: '#F8FAFC', color: '#002B5B' },
  { bg: '#F8FAFC', color: '#002B5B' },
  { bg: '#F8FAFC', color: '#002B5B' },
  { bg: '#F8FAFC', color: '#002B5B' },
  { bg: '#F8FAFC', color: '#002B5B' },
];

const BottomNavigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/student/dashboard' },
    { icon: BookOpen, label: 'Homework', path: '/student/homework' },
    { icon: Calendar, label: 'Attendance', path: '/student/attendance' },
    { icon: Wallet, label: 'Fees', path: '/student/fees' },
  ];

  const studentMenuItems = [
    
    { path: '/student/exams', icon: ClipboardList, label: 'Exams' },
    { path: '/student/results', icon: Award, label: 'Results' },
    { path: '/student/notices', icon: Bell, label: 'Notices' },
    { path: '/student/timetable', icon: Clock, label: 'Timetable' },
    { path: '/student/leave', icon: FileText, label: 'Leave' },
    { path: '/student/holidays', icon: CalendarDays, label: 'Holidays' },
    { path: '/student/profile', icon: User, label: 'Profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleNav = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      <style>{`
        .bottom-nav-bar {
          background: #ffffff;
          border-top: 1px solid #f1f5f9;
          box-shadow: 0 -4px 24px rgba(0, 43, 91, 0.10);
        }
        .bottom-tab {
          display: flex; flex-direction: column; align-items: center;
          padding: 8px 0 2px; flex: 1; cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          text-decoration: none !important;
          border: none !important;
          outline: none !important;
        }
        .bottom-tab-active .tab-icon-bg {
          background: linear-gradient(135deg, #002B5B 0%, #2D54A8 100%);
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 2px 8px rgba(0, 43, 91, 0.2);
        }
        .bottom-tab-active .tab-icon-bg svg { color: white !important; }
        .bottom-tab-active .tab-label { color: #002B5B; font-weight: 700; }
        .bottom-tab-inactive .tab-icon-bg { background: transparent; transform: translateY(0) scale(1); }
        .bottom-tab-inactive .tab-label { color: #9ca3af; font-weight: 500; }
        .menu-tab-active .tab-icon-bg {
          background: linear-gradient(135deg, #002B5B 0%, #2D54A8 100%);
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 2px 8px rgba(0, 43, 91, 0.2);
        }
        .menu-tab-active .tab-icon-bg svg { color: white !important; }
        .menu-tab-active .tab-label { color: #002B5B; font-weight: 700; }
        .tab-icon-bg {
          width: 34px; height: 34px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .tab-label {
          font-size: 10px; margin-top: 2px;
          transition: color 0.2s; letter-spacing: 0.01em;
        }
        .bottom-tab:active .tab-icon-bg { transform: translateY(-2px) scale(0.98); }
        a.bottom-tab { border: none !important; text-decoration: none !important; }
        a.bottom-tab:focus { outline: none !important; }

        .menu-sheet-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.55);
          z-index: 200; backdrop-filter: blur(3px);
          animation: fadeIn 0.2s ease;
        }
        .menu-sheet {
          position: fixed; bottom: 0; left: 0; right: 0;
          z-index: 201; border-radius: 28px 28px 0 0;
          max-height: 88vh; overflow-y: auto;
          animation: slideUpSheet 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
          background: #fff;
        }
        @keyframes slideUpSheet {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        .menu-icon-btn {
          display: flex; flex-direction: column; align-items: center;
          gap: 7px; padding: 12px 6px; border-radius: 18px;
          transition: all 0.15s ease; cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          background: transparent;
        }
        .menu-icon-btn:active { transform: scale(0.92); }
        .menu-icon-btn.active-item {
          background: rgba(0, 43, 91, 0.06);
        }
        .menu-icon-circle {
          width: 50px; height: 50px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.15s ease;
          box-shadow: none;
          border: 1px solid #f1f5f9;
        }
        .menu-icon-btn:active .menu-icon-circle {
          transform: scale(0.9);
        }
        .menu-sheet::-webkit-scrollbar { width: 0; }
      `}</style>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          <div className="menu-sheet-overlay" onClick={() => setIsMenuOpen(false)} />
          <div className="menu-sheet">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            <div className="mx-4 mt-2 mb-4 rounded-2xl p-3.5 flex items-center gap-3"
              style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
              <div className="w-12 h-12 rounded-2xl bg-white/20 overflow-hidden flex items-center justify-center flex-shrink-0">
                {user?.profile_image
                  ? <img src={user.profile_image} alt="" className="w-full h-full object-cover" />
                  : <FaUser className="text-white text-lg" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate">{user?.first_name} {user?.last_name}</p>
                <p className="text-white/60 text-[11px]">Student Panel</p>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/15 active:bg-white/25"
              >
                <X size={15} className="text-white" />
              </button>
            </div>

            <div className="px-3 pb-4">
              <div className="grid grid-cols-4 gap-1">
                {studentMenuItems.map((item, i) => {
                  const colorSet = iconColors[i % iconColors.length];
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      className="menu-icon-btn"
                      onClick={() => handleNav(item.path)}
                    >
                      <div className="menu-icon-circle" style={{ background: isActive ? theme.primary : colorSet.bg }}>
                        <item.icon
                          size={20}
                          style={{ color: isActive ? '#fff' : colorSet.color }}
                        />
                      </div>
                      <span
                        className="text-[10px] font-semibold text-center leading-tight"
                        style={{ color: '#374151' }}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}

                <button
                  className="menu-icon-btn"
                  onClick={handleLogout}
                >
                  <div className="menu-icon-circle" style={{ background: '#FFF1F2' }}>
                    <LogOut size={20} style={{ color: '#E11D48' }} />
                  </div>
                  <span className="text-[10px] font-semibold text-center leading-tight" style={{ color: '#E11D48' }}>
                    Logout
                  </span>
                </button>
              </div>
            </div>

            <div style={{ height: 'env(safe-area-inset-bottom, 16px)', minHeight: '16px' }} />
          </div>
        </>
      )}

      <nav className="bottom-nav-bar fixed bottom-0 left-0 right-0 z-50 flex md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={index}
              to={item.path}
              className={`bottom-tab ${isActive ? 'bottom-tab-active' : 'bottom-tab-inactive'}`}
            >
              <div className="tab-icon-bg">
                <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
              </div>
              <span className="tab-label">{item.label}</span>
            </NavLink>
          );
        })}

        <button
          className={`bottom-tab ${isMenuOpen ? 'menu-tab-active' : 'bottom-tab-inactive'}`}
          onClick={() => setIsMenuOpen(true)}
        >
          <div className="tab-icon-bg">
            <Menu size={18} className={isMenuOpen ? 'text-white' : 'text-gray-400'} />
          </div>
          <span className="tab-label">Menu</span>
        </button>
      </nav>
    </>
  );
};

export default BottomNavigation;
