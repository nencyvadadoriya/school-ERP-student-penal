import React, { useState, useEffect, useMemo } from 'react';
import { attendanceAPI } from '../../services/api';
import { Skeleton, CardSkeleton } from '../../components/Skeleton';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, format, addMonths, subMonths
} from 'date-fns';

// Safely parse any date value to a local yyyy-MM-dd string
// Handles ISO strings like "2026-04-10T00:00:00.000Z" without timezone shift
const toLocalDateKey = (dateVal: any): string => {
  try {
    if (dateVal == null) return '';
    const d = new Date(dateVal);
    if (Number.isNaN(d.getTime())) return '';
    return format(d, 'yyyy-MM-dd');
  } catch {
    return '';
  }
};

const normalizeStatus = (statusVal: any): string | null => {
  if (statusVal == null) return null;
  const s = String(statusVal).trim();
  if (!s) return null;
  const lower = s.toLowerCase();
  if (lower === 'present') return 'Present';
  if (lower === 'absent') return 'Absent';
  if (lower === 'late') return 'Late';
  if (lower === 'excused') return 'Excused';
  if (lower === 'on leave' || lower === 'onleave' || lower === 'leave') return 'On leave';
  return s;
};

const toIdString = (val: any): string => {
  if (val == null) return '';
  if (typeof val === 'string' || typeof val === 'number') return String(val);
  if (typeof val === 'object') {
    if (val._id != null) return String(val._id);
    if (val.id != null) return String(val.id);
  }
  return String(val);
};

const normalizeGr = (val: any): string => String(val ?? '').trim();

const STATUS_STYLES: Record<string, { bg: string; border: string; text: string; numText: string; labelText: string; dot: string }> = {
  Present:    { bg: 'bg-green-50',  border: 'border-green-100',  text: 'text-green-700', numText: 'text-green-700 font-bold', labelText: 'text-green-600', dot: 'bg-green-500' },
  Absent:     { bg: 'bg-red-50',    border: 'border-red-100',    text: 'text-red-700', numText: 'text-red-700 font-bold', labelText: 'text-red-600', dot: 'bg-red-500' },
  Late:       { bg: 'bg-yellow-50', border: 'border-yellow-100', text: 'text-yellow-700', numText: 'text-yellow-700 font-bold', labelText: 'text-yellow-600', dot: 'bg-yellow-400' },
  'On leave': { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-700', numText: 'text-purple-700 font-bold', labelText: 'text-purple-600', dot: 'bg-purple-500' },
  Excused:    { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-700', numText: 'text-purple-700 font-bold', labelText: 'text-purple-600', dot: 'bg-purple-500' },
};

const STATUS_INLINE: Record<string, { bg: string; border: string }> = {
  Present: { bg: '#22c55e', border: '#16a34a' },
  Absent: { bg: '#ef4444', border: '#dc2626' },
  Late: { bg: '#facc15', border: '#eab308' },
  'On leave': { bg: '#a855f7', border: '#9333ea' },
  Excused: { bg: '#a855f7', border: '#9333ea' },
};
const StudentAttendance: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [summary, setSummary] = useState({ present: 0, absent: 0, total: 0, percentage: 0 });
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date());

  useEffect(() => {
    if (authLoading) return;
    const load = async () => {
      if (!user) { setLoading(false); return; }
      try {
        const params: any = {
          gr_number: user?.gr_number,
        };
        if (user?._id) params.student_id = user._id;
        if (user?.class_code && String(user.class_code).trim() && String(user.class_code) !== 'undefined' && String(user.class_code) !== 'null') {
          params.class_code = user.class_code;
        }

        const sumR = await attendanceAPI.getStudentSummary(params);

        const payload = sumR.data.data || {};
        setSummary(payload);
        setRecords(Array.isArray(payload.entries) ? payload.entries : []);

        if (import.meta.env.DEV) {
          console.log('[StudentAttendance] user', { gr_number: user?.gr_number, _id: user?._id, class_code: user?.class_code });
          console.log('[StudentAttendance] entries', Array.isArray(payload.entries) ? payload.entries.length : 0, (payload.entries || []).slice(0, 5));
        }
      } catch (e) {
        console.error('Failed to load attendance', e);
      }
      setLoading(false);
    };
    load();
  }, [authLoading, user?.gr_number, user?.class_code, user]);

  // Build date -> status map using timezone-safe parsing
  const monthMap = useMemo(() => {
    const m = new Map<string, string>();
    (records || []).forEach(r => {
      const key = toLocalDateKey(r.date);
      const norm = normalizeStatus(r.status);
      if (key && norm) m.set(key, norm);
    });
    return m;
  }, [records]);

  const pct = summary.percentage || 0;
  const pctColor = pct >= 75 ? 'text-green-600' : pct >= 60 ? 'text-yellow-600' : 'text-red-600';

  if (authLoading || loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F0F2F5' }}>
        <div className="w-full px-2 py-3 md:px-4 md:py-4 lg:px-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-96">
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-40" />
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center text-gray-700">
          Please login to view attendance.
        </div>
      </div>
    );
  }

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const dayCells: Date[] = [];
  for (let d = startDate; d <= endDate; d = addDays(d, 1)) dayCells.push(new Date(d));

  const statCards = [
    { label: 'Attendance', value: `${pct}%`, colorClass: 'text-[#002B5B]', icon: 'GraduationCap', subtile: 'this month' },
    { label: 'Present', value: summary.present, colorClass: 'text-[#002B5B]', icon: 'ClipboardList', subtile: 'total days' },
    { label: 'Absent', value: summary.absent, colorClass: 'text-[#002B5B]', icon: 'X', subtile: 'total days' },
    { label: 'Total Days', value: summary.total, colorClass: 'text-[#002B5B]', icon: 'Calendar', subtile: 'this session' },
  ];

  const legend = [
    { label: 'Present', color: 'bg-green-500' },
    { label: 'Absent', color: 'bg-red-500' },
    { label: 'Late', color: 'bg-yellow-400' },
    { label: 'On leave', color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0F2F5' }}>
      {/* Mobile Header */}
      <div className="md:hidden bg-[#002B5B] pt-6 pb-8 px-4">
        <h1 className="text-lg font-bold text-white">Attendance</h1>
        <p className="text-[10px] mt-0.5 text-white/80">Track your daily attendance and performance</p>
      </div>

      <div className="w-full px-3 py-3 md:px-4 md:py-4 lg:px-6">
        {/* Desktop Header & Stats */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Attendance</h1>
              <p className="text-[10px] mt-0.5 font-medium text-gray-500">Track your daily attendance and performance</p>
            </div>
            <div className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-xl border border-gray-100 shadow-sm self-start sm:self-auto">
              <div className="flex flex-col items-end px-3">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Attendance</span>
                <span className="text-sm font-bold text-blue-600 leading-none">{pct}%</span>
              </div>
              <div className="w-px h-6 bg-gray-200"></div>
              <div className="flex flex-col items-end px-3">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Academic Year</span>
                <span className="text-sm font-bold text-gray-900 leading-none">2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Container 2: Summary Stats */}
        <div className="w-full px-0 relative z-10 md:mt-0 mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {statCards.map(({ label, value, colorClass, subtile }) => (
              <div key={label} className="bg-white rounded-lg border border-gray-100 p-3 md:p-3.5 hover:shadow-sm transition-shadow duration-200">
                <div className="flex flex-col items-start">
                  <p className="text-[9px] md:text-[10px] font-semibold text-gray-500 mb-0.5 uppercase tracking-wider truncate">{label}</p>
                  <div className="flex items-baseline gap-1">
                    <p className={`text-base md:text-lg font-bold ${label === 'Attendance' ? colorClass : 'text-[#002B5B]'}`}>
                      {value}
                    </p>
                  </div>
                  {subtile && <p className="text-[9px] md:text-[10px] text-gray-400 font-medium mt-0.5">{subtile}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Calendar Header */}
          <div className="p-4 border-b border-gray-50 bg-gray-50/20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}
                className="w-9 h-9 flex items-center justify-center bg-white hover:bg-gray-50 text-gray-400 hover:text-gray-600 rounded-xl shadow-sm border border-gray-100 transition-all active:scale-95"
              >
                <span className="text-xl leading-none">‹</span>
              </button>
              <h2 className="text-base font-bold text-gray-900 min-w-[140px] text-center tracking-tight">
                {format(monthStart, 'MMMM yyyy')}
              </h2>
              <button
                onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
                className="w-9 h-9 flex items-center justify-center bg-white hover:bg-gray-50 text-gray-400 hover:text-gray-600 rounded-xl shadow-sm border border-gray-100 transition-all active:scale-95"
              >
                <span className="text-xl leading-none">›</span>
              </button>
            </div>
          </div>

          <div className="p-3 md:p-6">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 md:gap-2 mb-3">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-[10px] md:text-[11px] font-bold text-gray-400 text-center uppercase tracking-wider py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {dayCells.map((day, idx) => {
                const key = toLocalDateKey(day);
                const status = key ? monthMap.get(key) : undefined;
                const inMonth = day.getMonth() === monthStart.getMonth();
                const style = status ? STATUS_STYLES[status] : null;
                const isToday = key === toLocalDateKey(new Date());

                return (
                  <div
                    key={idx}
                    className={`
                      relative rounded-lg border transition-all duration-200
                      min-h-[45px] md:min-h-[70px] p-1 md:p-2 flex flex-col items-center justify-center gap-1
                      ${!inMonth
                        ? 'bg-gray-50/50 border-transparent opacity-30'
                        : style
                          ? `${style.bg} ${style.border} shadow-sm`
                          : isToday
                            ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-100'
                            : 'bg-white border-gray-100 hover:border-blue-100 hover:bg-blue-50/30'}
                    `}
                  >
                    <span className={`
                      text-xs md:text-sm font-bold
                      ${style ? style.text : isToday ? 'text-[#002B5B]' : 'text-gray-900'}
                    `}>
                      {format(day, 'd')}
                    </span>
                    
                    {status && inMonth && (
                      <div className={`
                        hidden sm:block text-[9px] font-bold uppercase tracking-tight px-1.5 py-0.5 rounded
                        ${style?.labelText} bg-white/40
                      `}>
                        {status === 'On leave' ? 'Leave' : status}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-row items-center justify-center gap-2 md:gap-4 border-t border-gray-100 pt-5 overflow-x-auto no-scrollbar">
              {legend.map(l => (
                <div key={l.label} className="flex items-center gap-1.5 flex-shrink-0">
                  <div className={`${l.color} w-2 h-2 md:w-3 md:h-3 rounded-full shadow-sm`}></div>
                  <span className="text-[8px] md:text-[10px] font-bold text-gray-500 uppercase tracking-wider">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;