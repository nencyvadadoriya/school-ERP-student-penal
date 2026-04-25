import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SidebarSkeleton } from './Skeleton';

 type MenuItem = {
   path: string;
   icon: React.ComponentType<{ className?: string }>;
   label: string;
   section: string;
 };

import {
  FaTachometerAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaCalendarCheck,
  FaClipboardList,
  FaMoneyBillWave,
  FaBell,
  FaCalendarAlt,
  FaFileAlt,
  FaClock,
  FaSignOutAlt,
  FaUser,
  FaSchool,
  FaBars,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar, isCollapsed, setIsCollapsed }) => {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <>
        <div className={`flex-shrink-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-56'} hidden lg:block`}>
          <SidebarSkeleton isCollapsed={isCollapsed} />
        </div>
        <aside
          className={`fixed top-0 left-0 z-50 h-screen bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out flex flex-col w-64 ${
            isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          } lg:hidden`}
        >
          <SidebarSkeleton isCollapsed={false} />
        </aside>
      </>
    );
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const adminMenuItems: MenuItem[] = [
    { path: '/admin/dashboard', icon: FaTachometerAlt, label: 'Dashboard', section: 'main' },
    { path: '/admin/students', icon: FaUserGraduate, label: 'Students', section: 'management' },
    { path: '/admin/teachers', icon: FaChalkboardTeacher, label: 'Teachers', section: 'management' },
    { path: '/admin/classes', icon: FaSchool, label: 'Classes', section: 'management' },
    { path: '/admin/subjects', icon: FaBook, label: 'Subjects', section: 'management' },
    { path: '/admin/attendance', icon: FaCalendarCheck, label: 'Attendance', section: 'academic' },
    { path: '/admin/exams', icon: FaClipboardList, label: 'Exams', section: 'academic' },
    { path: '/admin/fees', icon: FaMoneyBillWave, label: 'Fees', section: 'finance' },
    { path: '/admin/notices', icon: FaBell, label: 'Notices', section: 'communication' },
    { path: '/admin/events', icon: FaCalendarAlt, label: 'Events', section: 'communication' },
    { path: '/admin/leave', icon: FaFileAlt, label: 'Leave Management', section: 'communication' },
    { path: '/admin/timetable', icon: FaClock, label: 'Timetable', section: 'academic' },
  ];

  const teacherMenuItems: MenuItem[] = [
    { path: '/teacher/dashboard', icon: FaTachometerAlt, label: 'Dashboard', section: 'main' },
    { path: '/teacher/attendance', icon: FaCalendarCheck, label: 'Attendance', section: 'academic' },
    { path: '/teacher/homework', icon: FaClipboardList, label: 'Homework', section: 'academic' },
    { path: '/teacher/exams', icon: FaClipboardList, label: 'Exams', section: 'academic' },
    { path: '/teacher/results', icon: FaFileAlt, label: 'Results', section: 'academic' },
    { path: '/teacher/timetable', icon: FaClock, label: 'Timetable', section: 'academic' },
    { path: '/teacher/notices', icon: FaBell, label: 'Notices', section: 'communication' },
    { path: '/teacher/leave', icon: FaFileAlt, label: 'Leave Application', section: 'communication' },
  ];

  const studentMenuItems: MenuItem[] = [
    { path: '/student/dashboard', icon: FaTachometerAlt, label: 'Dashboard', section: 'main' },
    { path: '/student/attendance', icon: FaCalendarCheck, label: 'Attendance', section: 'academic' },
    { path: '/student/homework', icon: FaClipboardList, label: 'Homework', section: 'academic' },
    { path: '/student/exams', icon: FaClipboardList, label: 'Exams', section: 'academic' },
    { path: '/student/results', icon: FaFileAlt, label: 'Results', section: 'academic' },
    { path: '/student/fees', icon: FaMoneyBillWave, label: 'Fees', section: 'finance' },
    { path: '/student/timetable', icon: FaClock, label: 'Timetable', section: 'academic' },
    { path: '/student/notices', icon: FaBell, label: 'Notices & Events', section: 'communication' },
    { path: '/student/holidays', icon: FaCalendarAlt, label: 'Holiday Calendar', section: 'communication' },
    { path: '/student/leave', icon: FaFileAlt, label: 'Leave Application', section: 'communication' },
  ];

  const getMenuItems = (): MenuItem[] => {
    if (user?.role === 'admin') return adminMenuItems;
    if (user?.role === 'teacher') return teacherMenuItems;
    if (user?.role === 'student') return studentMenuItems;
    return [];
  };

  // Group menu items by section
  const groupMenuItemsBySection = (items: MenuItem[]) => {
    const sections = {
      main: { title: '', order: 1, showTitle: false },
      management: { title: 'Management', order: 2, showTitle: true },
      academic: { title: 'Academic', order: 3, showTitle: true },
      finance: { title: 'Finance', order: 4, showTitle: true },
      communication: { title: 'Communication', order: 5, showTitle: true }
    };

    const grouped: Record<string, MenuItem[]> = {};
    items.forEach(item => {
      const section = item.section;
      if (!grouped[section]) {
        grouped[section] = [];
      }
      grouped[section].push(item);
    });

    return { grouped, sections };
  };

  const { grouped, sections } = groupMenuItemsBySection(getMenuItems());

  // Sort sections by order
  const sortedSections = Object.keys(grouped).sort((a, b) =>
    (sections[a]?.order || 999) - (sections[b]?.order || 999)
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-3 left-4 z-50 lg:hidden bg-primary-600 text-white p-2.5 rounded-lg shadow-md hover:bg-primary-700 transition-colors"
      >
        <FaBars className="text-lg" />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={toggleSidebar}
        ></div>
      )}

      <div className={`flex-shrink-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-56'} hidden lg:block`}>
        <aside
          className={`h-screen bg-white border-r border-gray-200 flex flex-col sticky top-0 ${isCollapsed ? 'w-16' : 'w-56'}`}
        >
        {/* Logo Section */}
    <div className="h-14 flex-shrink-0 flex items-center justify-between border-b border-gray-200  px-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7  rounded-lg flex items-center justify-center">
              <FaSchool className="text-[#002B5B] text-base" />
            </div>
            {!isCollapsed && <h1 className="text-base font-bold  tracking-tight">SmartSchool</h1>}
          </div>
          <button
            onClick={toggleCollapse}
            className=" p-1 rounded-lg transition-colors hidden lg:block"
          >
            {isCollapsed ? <FaChevronRight size={12} /> : <FaChevronLeft size={12} />}
          </button>
        </div>

        {/* Menu Items with Section Titles - Scrollable Area */}
        <nav className="flex-1 overflow-y-auto min-h-0 p-2">
          {!isCollapsed ? (
            <div className="space-y-3">
              {sortedSections.map(sectionKey => {
                const sectionConfig = sections[sectionKey];
                const shouldShowTitle = sectionConfig?.showTitle !== false;

                return (
                  <div key={sectionKey}>
                    {shouldShowTitle && sectionConfig?.title && (
                      <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-2">
                        {sectionConfig.title}
                      </h3>
                    )}
                    <ul className="space-y-0.5">
                      {grouped[sectionKey].map((item) => (
                        <li key={item.path}>
                          <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                              `flex items-center rounded-lg transition-all duration-200 ${
                                isActive
                                  ? 'bg-[#002B5B] !text-white shadow-md shadow-[#002B5B]/20'
                                  : 'text-gray-500 hover:bg-gray-100 hover:text-[#002B5B]'
                              } space-x-2.5 px-3 py-2`
                            }
                            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                          >
                            <item.icon className={`text-sm flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''}`} />
                            {!isCollapsed && <span className="text-[12px] font-semibold truncate">{item.label}</span>}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : (
            <ul className="space-y-1.5">
              {sortedSections.map(sectionKey => (
                <React.Fragment key={sectionKey}>
                  {grouped[sectionKey].map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center justify-center rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-[#002B5B] text-white shadow-md shadow-[#002B5B]/20'
                              : 'text-gray-500 hover:bg-gray-50 hover:text-[#002B5B]'
                          } p-2`
                        }
                        onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                        title={item.label}
                      >
                        <item.icon className="text-lg flex-shrink-0" />
                      </NavLink>
                    </li>
                  ))}
                </React.Fragment>
              ))}
            </ul>
          )}
        </nav>

        {/* Profile & Logout - Fixed at bottom */}
        <div className="flex-shrink-0 border-t border-gray-200 p-1.5">
          {!isCollapsed ? (
            <div className="space-y-0.5">
              <NavLink
                to={`/${user?.role}/profile`}
                className={({ isActive }) =>
                  `flex items-center rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-[#002B5B] text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } space-x-2 px-2.5 py-1.5`
                }
              >
                <FaUser className="text-xs flex-shrink-0" />
                <span className="text-[11px] font-medium truncate">Profile</span>
              </NavLink>
              <button
                onClick={logout}
                className="w-full flex items-center rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 space-x-2 px-2.5 py-1.5"
              >
                <FaSignOutAlt className="text-xs flex-shrink-0" />
                <span className="text-[11px] font-medium truncate">Logout</span>
              </button>
            </div>
          ) : (
            <div className="space-y-0.5">
              <NavLink
                to={`/${user?.role}/profile`}
                className={({ isActive }) =>
                  `flex items-center justify-center rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-[#002B5B] text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } px-1.5 py-2`
                }
                title="Profile"
              >
                <FaUser className="text-sm flex-shrink-0" />
              </NavLink>
              <button
                onClick={logout}
                className="w-full flex items-center justify-center rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 px-1.5 py-2"
                title="Logout"
              >
                <FaSignOutAlt className="text-sm flex-shrink-0" />
              </button>
            </div>
          )}
        </div>
        </aside>
      </div>

      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out flex flex-col w-64 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } lg:hidden`}
      >
        {/* Mobile Header Section */}
        <div className="h-16 flex-shrink-0 flex items-center justify-between border-b border-gray-200 bg-[#002B5B] px-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <FaSchool className="text-[#002B5B] text-lg" />
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight">SmartSchool ERP</h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="text-white/80 hover:text-white p-1.5 rounded-lg transition-colors"
          >
            <FaChevronLeft />
          </button>
        </div>

        {/* Menu Items for Mobile */}
        <nav className="flex-1 overflow-y-auto min-h-0 p-3 bg-gray-50/50">
          <div className="space-y-6">
            {sortedSections.map(sectionKey => {
              const sectionConfig = sections[sectionKey];
              const shouldShowTitle = sectionConfig?.showTitle !== false;

              return (
                <div key={sectionKey} className="space-y-2">
                  {shouldShowTitle && sectionConfig?.title && (
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-1">
                      {sectionConfig.title}
                    </h3>
                  )}
                  <ul className="space-y-1">
                    {grouped[sectionKey].map((item) => (
                      <li key={item.path}>
                        <NavLink
                          to={item.path}
                          className={({ isActive }) =>
                            `flex items-center rounded-xl transition-all duration-200 group ${
                              isActive
                                ? 'bg-[#002B5B] text-white shadow-lg shadow-[#002B5B]/20'
                                : 'text-gray-500 hover:bg-[#002B5B]/5 hover:text-[#002B5B]'
                            } space-x-4 px-5 py-3.5`
                          }
                          onClick={() => toggleSidebar()}
                        >
                          <item.icon className={`text-lg flex-shrink-0 group-hover:text-[#002B5B] ${isOpen ? 'animate-in fade-in slide-in-from-left-2 duration-300' : ''}`} />
                          <span className="text-sm font-semibold tracking-wide">{item.label}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Profile & Logout - Mobile Bottom */}
        <div className="flex-shrink-0 border-t border-gray-200 p-3 bg-white">
          <div className="space-y-1">
            <NavLink
              to={`/${user?.role}/profile`}
              className={({ isActive }) =>
                `flex items-center rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
                    : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
                } space-x-3 px-4 py-3`
              }
              onClick={() => toggleSidebar()}
            >
              <FaUser className="text-lg flex-shrink-0" />
              <span className="text-sm font-semibold tracking-wide">My Profile</span>
            </NavLink>
            <button
              onClick={logout}
              className="w-full flex items-center rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 space-x-3 px-4 py-3"
            >
              <FaSignOutAlt className="text-lg flex-shrink-0" />
              <span className="text-sm font-semibold tracking-wide">Logout Account</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;