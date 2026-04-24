import React, { useState, useRef, useEffect } from 'react';
import { FaBars, FaBell, FaUser, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar} 
          className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
          aria-label="Toggle Sidebar"
        >
          <FaBars className="text-lg" />
        </button>
        <div className="hidden sm:flex flex-col">
          <p className="text-[13px] font-bold text-gray-900">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 px-3 py-1.5 rounded-2xl transition-all duration-200"
          >
            <div className="hidden text-right sm:block">
              <p className="text-[12px] font-bold text-gray-900 leading-tight truncate max-w-[150px]">{user?.first_name} {user?.last_name}</p>
              <p className="text-[9px] font-bold text-[#002B5B] uppercase tracking-widest">{user?.role}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#002B5B] flex items-center justify-center overflow-hidden shadow-sm shadow-[#002B5B]/10">
              {user?.profile_image
                ? <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                : <FaUser className="text-white text-base" />}
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-200">
              <div className="px-3 py-2 border-b border-gray-50 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#002B5B] flex items-center justify-center overflow-hidden shadow-sm">
                  {user?.profile_image
                    ? <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                    : <FaUser className="text-white text-sm" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-gray-900 truncate">{user?.first_name} {user?.last_name}</p>
                  <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
              
              <div className="p-1.5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 text-[13px] font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                >
                  <div className="w-7 h-7 flex items-center justify-center rounded-md bg-red-50 group-hover:bg-red-100 transition-colors">
                    <FaSignOutAlt className="text-xs" />
                  </div>
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
