import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, AlertCircle, Clock, Award,
  Calendar, BookOpen, DollarSign, FileText, ChevronRight,
  ArrowUp, ArrowDown, GraduationCap, Users, Layout, ClipboardList , Wallet,
  X
} from 'lucide-react';
import { toast } from 'react-toastify';
import { dashboardAPI, homeworkAPI } from '../../services/api';
import { Skeleton, CardSkeleton, ListSkeleton } from '../../components/Skeleton';
import { useAuth } from '../../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, AreaChart, Area, Cell
} from 'recharts';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const [showCharts, setShowCharts] = useState<boolean>(false);

  const theme = {
    primary: '#002B5B',
    secondary: '#2D54A8',
    accent: '#FFC107',
    background: '#F0F2F5',
    white: '#FFFFFF',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444'
  };

  const performanceData = [
    { subject: 'Math', score: 85, class_avg: 78 },
    { subject: 'English', score: 92, class_avg: 85 },
    { subject: 'Science', score: 88, class_avg: 82 },
    { subject: 'Hindi', score: 90, class_avg: 84 },
    { subject: 'SST', score: 82, class_avg: 80 },
    { subject: 'PE', score: 95, class_avg: 88 },
  ];

  const attendanceData = [
    { month: 'Jan', percentage: 94 },
    { month: 'Feb', percentage: 92 },
    { month: 'Mar', percentage: 96 },
    { month: 'Apr', percentage: 91 },
    { month: 'May', percentage: 95 },
    { month: 'Jun', percentage: 93 },
  ];

  useEffect(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const checkMobile = () => setIsMobile(window.innerWidth < 768);

  useEffect(() => {
    dashboardAPI.student()
      .then(r => setData(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));

    homeworkAPI.checkMyHomework()
      .then(r => {
        if (r.data.success && r.data.has_new_homework) {
          r.data.homework.forEach((hw: any) => {
            toast.info(`New Homework: ${hw.title} for ${hw.subject_code}`, {
              position: "top-right",
              autoClose: 6000,
            });
          });
        }
      })
      .catch(console.error);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: theme.background }}>
        <div className="w-full px-2 py-3 md:px-4 md:py-4 lg:px-6">
          <div className="mb-4 space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 h-72">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-full w-full" />
            </div>
            <div className="bg-white rounded-lg p-4 h-72">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-full w-full" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 h-64">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 h-64">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color = 'primary',
    trend,
    subtile 
  }: any) => {
    const colors: any = {
      primary: { bg: '#e6f0f9', icon: '#002B5B', text: '#002B5B' },
      secondary: { bg: '#e6f0f9', icon: '#002B5B', text: '#002B5B' },
      success: { bg: '#e6f0f9', icon: '#002B5B', text: '#002B5B' },
      warning: { bg: '#e6f0f9', icon: '#002B5B', text: '#002B5B' },
      danger: { bg: '#e6f0f9', icon: '#002B5B', text: '#002B5B' },
    };

    const colorScheme = colors[color] || colors.primary;

    return (
      <div className="bg-white rounded-lg border border-gray-100 p-3 md:p-3.5 hover:shadow-sm transition-shadow duration-200">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-[9px] md:text-[10px] font-semibold text-gray-500 mb-0.5 uppercase tracking-wider truncate">{title}</p>
            <div className="flex items-baseline gap-1">
              <p className="text-base md:text-lg font-bold" style={{ color: colorScheme.text }}>
                {value}
              </p>
              {trend && (
                <span className="flex items-center gap-0.5 text-[9px] md:text-[10px] font-bold">
                  {trend > 0 ? (
                    <ArrowUp size={10} style={{ color: '#10B981' }} />
                  ) : (
                    <ArrowDown size={10} style={{ color: '#EF4444' }} />
                  )}
                  <span style={{ color: trend > 0 ? '#10B981' : '#EF4444' }}>
                    {Math.abs(trend)}%
                  </span>
                </span>
              )}
            </div>
            {subtile && <p className="text-[9px] md:text-[10px] text-gray-400 font-medium mt-0.5">{subtile}</p>}
          </div>
          <div 
            className="p-1.5 md:p-2 rounded-lg flex-shrink-0 ml-1"
            style={{ backgroundColor: colorScheme.bg }}
          >
            <Icon size={16} className="md:w-[18px] md:h-[18px]" style={{ color: colorScheme.icon }} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0" style={{ backgroundColor: theme.background }}>
      {/* Mobile Proper Header - Only for Dashboard */}
      <div className="md:hidden bg-white px-5 py-3 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
         
          <h2 className="text-base font-bold text-[#002B5B]">SmartSchool ERP</h2>
        </div>
        <img 
          src={user?.profile_image || "https://ui-avatars.com/api/?name=" + (user?.first_name || 'User') + "&background=random"} 
          alt="Profile" 
          className="w-9 h-9 rounded-lg border border-gray-200 object-cover"
        />
      </div>

      {/* Mobile Header with Rounded Shape */}
      <div className="md:hidden bg-[#002B5B] pt-10 pb-12 px-5 rounded-b-[35px] relative">
        <div className="text-white">
          <h1 className="text-xl font-bold">Welcome, {user?.first_name || 'Student'}</h1>
          <div className="flex items-center gap-2 mt-1 opacity-80">
            <Calendar size={12} />
            <span className="text-[11px]">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      <div className="w-full px-3 -mt-6 relative z-10 md:mt-0 md:py-6 lg:px-8">
        {/* Desktop Header */}
        <div className="hidden md:block mb-6">
          <h1 className="text-2xl font-bold" style={{ color: theme.textPrimary }}>
            Welcome, {user?.first_name || 'Student'}
          </h1>
          <p style={{ color: theme.textSecondary }} className="text-sm mt-1 font-medium">
            Here's your academic performance overview
          </p>
        </div>

        {/* Main Stats Grid - Same as desktop but visible on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-6">
          <StatCard 
            title="Attendance" 
            value={`${data?.attendancePercentage || 0}%`}
            icon={GraduationCap}
            color="success"
            trend={data?.attendancePercentage > 90 ? 5 : -2}
            subtile="this month"
          />
          <StatCard 
            title="Pending Homework" 
            value={data?.pendingHomework || 0}
            icon={ClipboardList}
            color="warning"
            subtile="assignments"
          />
          <StatCard 
            title="Fees Due" 
            value={`₹${data?.feeDue || 0}`}
            icon={DollarSign}
            color="danger"
            subtile="pending"
          />
          <StatCard 
            title="Upcoming Exams" 
            value={data?.upcomingExams?.length || 0}
            icon={BookOpen}
            color="primary"
            subtile="scheduled"
          />
        </div>

        {/* View Stats Button - Mobile Only */}
        <button 
          onClick={() => setShowCharts(true)}
          className="md:hidden w-full bg-[#2D54A8] text-white py-3 rounded-xl mb-6 flex items-center justify-between px-4 shadow-md text-sm"
        >
          <div className="flex items-center gap-2">
            <TrendingUp size={16} />
            <span className="font-bold text-sm">View All Charts</span>
          </div>
          <ChevronRight size={16} />
        </button>

        {/* Charts Full-screen Overlay - Mobile Only */}
        {showCharts && (
          <div className="fixed inset-0 z-[100] bg-[#F8FAFC] overflow-y-auto pb-24">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-[#F8FAFC]/90 backdrop-blur-sm py-2 z-10">
                <div>
                  <h2 className="text-lg font-bold text-[#002B5B]">All Stats & Charts</h2>
                  <p className="text-[10px] text-gray-500 font-medium mt-0.5">Academic overview</p>
                </div>
                <button 
                  onClick={() => setShowCharts(false)}
                  className="p-1.5 bg-white border border-gray-100 rounded-full text-gray-600 shadow-sm"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 pb-10">
                {/* Subject Performance */}
                <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-xs font-bold text-[#002B5B]">Subject Performance</h3>
                      <p className="text-[9px] text-gray-500 font-medium">Your score vs class average</p>
                    </div>
                    <BarChart3 size={14} className="text-[#002B5B]" />
                  </div>
                  <div className="w-full h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData} margin={{ top: 5, right: 5, left: -35, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="subject" stroke="#94A3B8" tick={{ fontSize: 8, fontWeight: 600 }} axisLine={false} tickLine={false} />
                        <YAxis stroke="#94A3B8" tick={{ fontSize: 8, fontWeight: 600 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '9px' }} />
                        <Bar dataKey="score" fill="#002B5B" radius={[3, 3, 0, 0]} barSize={16} />
                        <Bar dataKey="class_avg" fill="#2D54A8" radius={[3, 3, 0, 0]} barSize={16} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Attendance Trend */}
                <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-xs font-bold text-[#002B5B]">Attendance Trend</h3>
                      <p className="text-[9px] text-gray-500 font-medium">Monthly attendance percentage</p>
                    </div>
                    <TrendingUp size={14} className="text-[#2D54A8]" />
                  </div>
                  <div className="w-full h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={attendanceData} margin={{ top: 5, right: 5, left: -35, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorAttendanceOverlay" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2D54A8" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#2D54A8" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="month" stroke="#94A3B8" tick={{ fontSize: 8, fontWeight: 600 }} axisLine={false} tickLine={false} />
                        <YAxis stroke="#94A3B8" tick={{ fontSize: 8, fontWeight: 600 }} domain={[80, 100]} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '9px' }} />
                        <Area type="monotone" dataKey="percentage" stroke="#2D54A8" strokeWidth={2} fillOpacity={1} fill="url(#colorAttendanceOverlay)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Sections */}
        <div className="hidden md:block">
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* ... charts code ... */}
          </div>
        </div>

        {/* Existing logic for charts and lists - ensuring they are visible on desktop */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Performance Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-bold" style={{ color: theme.textPrimary }}>
                  Subject Performance
                </h2>
                <p style={{ color: theme.textSecondary }} className="text-[11px] font-medium">
                  Your score vs class average
                </p>
              </div>
              <BarChart3 size={16} style={{ color: theme.primary }} />
            </div>
            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="subject" stroke={theme.textSecondary} tick={{ fontSize: 10, fontWeight: 500 }} axisLine={false} tickLine={false} />
                  <YAxis stroke={theme.textSecondary} tick={{ fontSize: 10, fontWeight: 500 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme.white, 
                      border: `1px solid #E5E7EB`,
                      borderRadius: '8px',
                      fontSize: '11px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="score" fill={theme.primary} radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="class_avg" fill={theme.secondary} radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Attendance Trend */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-bold" style={{ color: theme.textPrimary }}>
                  Attendance Trend
                </h2>
                <p style={{ color: theme.textSecondary }} className="text-[11px] font-medium">
                  Monthly attendance percentage
                </p>
              </div>
              <TrendingUp size={16} style={{ color: theme.secondary }} />
            </div>
            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.secondary} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={theme.secondary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="month" stroke={theme.textSecondary} tick={{ fontSize: 10, fontWeight: 500 }} axisLine={false} tickLine={false} />
                  <YAxis stroke={theme.textSecondary} tick={{ fontSize: 10, fontWeight: 500 }} domain={[80, 100]} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme.white, 
                      border: `1px solid #E5E7EB`,
                      borderRadius: '8px',
                      fontSize: '11px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="percentage" 
                    stroke={theme.secondary} 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorAttendance)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Upcoming Exams */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <h2 className="text-base font-bold mb-3 flex items-center gap-2" style={{ color: theme.textPrimary }}>
              <Award size={18} style={{ color: theme.primary }} />
              Upcoming Exams
            </h2>
            {!data?.upcomingExams?.length ? (
              <div className="text-center py-6">
                <AlertCircle size={24} style={{ color: theme.textSecondary }} className="mx-auto mb-2 opacity-50" />
                <p style={{ color: theme.textSecondary }} className="text-xs">No upcoming exams</p>
              </div>
            ) : (
              <div className="space-y-2">
                {data.upcomingExams.slice(0, 5).map((exam: any) => (
                  <div 
                    key={exam._id} 
                    className="p-3 rounded-lg border transition-all duration-200"
                    style={{ 
                      borderColor: '#F3F4F6',
                      backgroundColor: '#F9FAFB'
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-[13px] font-bold" style={{ color: theme.textPrimary }}>
                          {exam.exam_name}
                        </p>
                        <p style={{ color: theme.textSecondary }} className="text-[11px] font-medium">
                          {exam.subject_code} • {new Date(exam.exam_date).toLocaleDateString()}
                        </p>
                      </div>
                      <ChevronRight size={14} style={{ color: theme.secondary }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Latest Notices */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <h2 className="text-base font-bold mb-3 flex items-center gap-2" style={{ color: theme.textPrimary }}>
              <FileText size={18} style={{ color: theme.primary }} />
              Latest Notices
            </h2>
            {!data?.notices?.length ? (
              <div className="text-center py-6">
                <AlertCircle size={24} style={{ color: theme.textSecondary }} className="mx-auto mb-2 opacity-50" />
                <p style={{ color: theme.textSecondary }} className="text-xs">No new notices</p>
              </div>
            ) : (
              <div className="space-y-2">
                {data.notices.slice(0, 5).map((notice: any) => (
                  <div 
                    key={notice._id} 
                    className="p-3 rounded-lg border transition-all duration-200"
                    style={{ 
                      borderColor: '#F3F4F6',
                      backgroundColor: '#F9FAFB'
                    }}
                  >
                    <p className="text-[13px] font-bold" style={{ color: theme.textPrimary }}>
                      {notice.title}
                    </p>
                    <p style={{ color: theme.textSecondary }} className="text-[11px] font-medium line-clamp-2 mt-0.5 leading-relaxed">
                      {notice.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;