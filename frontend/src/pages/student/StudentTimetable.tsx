import React, { useState, useEffect } from 'react';
import { 
  Clock, Calendar, BookOpen, AlertCircle, ChevronLeft, ChevronRight,
  Navigation2
} from 'lucide-react';
import { timetableAPI, classAPI, shiftBreakTimeAPI } from '../../services/api';
import { Skeleton, CardSkeleton } from '../../components/Skeleton';
import { useAuth } from '../../context/AuthContext';

const toTimeStr = (s: any) => (s === undefined || s === null ? '' : String(s));

const timeToMinutes = (t: any) => {
  const s = toTimeStr(t);
  const m = /^([0-1]\d|2[0-3]):([0-5]\d)$/.exec(s);
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
};

const StudentTimetable: React.FC = () => {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [shift, setShift] = useState<string>('');
  const [shiftBreakTimes, setShiftBreakTimes] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [isMobile, setIsMobile] = useState<boolean>(false);

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
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const checkMobile = () => setIsMobile(window.innerWidth < 768);

  const fetchTimetable = async () => {
    try {
      const classCode = user?.class_code;
      if (classCode) {
        const r = await timetableAPI.getByClass(classCode);
        setTimetable(r.data.data || null);
      }
    } catch (e: any) {
      console.error('Error fetching student timetable:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTimetable();
    }
  }, [user]);

  useEffect(() => {
    const fetchShiftInfo = async () => {
      try {
        const classCode = user?.class_code;
        if (!classCode) return;

        try {
          const cR = await classAPI.getByCode(classCode);
          setShift(cR.data.data?.shift || '');
        } catch (e) {
          setShift('');
        }

        try {
          const bR = await shiftBreakTimeAPI.getAll();
          setShiftBreakTimes(bR.data.data || []);
        } catch (e) {
          setShiftBreakTimes([]);
        }
      } catch (e) {
        setShift('');
        setShiftBreakTimes([]);
      }
    };

    if (user) fetchShiftInfo();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F0F2F5' }}>
        <div className="w-full px-2 py-3 md:px-4 md:py-4 lg:px-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-3 w-64" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-10 w-20 rounded-xl" />
                <Skeleton className="h-10 w-20 rounded-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 bg-gray-50/20">
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="p-4">
              <div className="grid grid-cols-7 gap-4 mb-4">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-7 gap-4">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <Skeleton key={j} className="h-16 w-full rounded-xl" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const viewSchedule = Array.isArray(timetable?.schedule) ? timetable.schedule : [];
  const allPeriods: any[] = [];
  viewSchedule.forEach((d: any) => {
    (Array.isArray(d?.periods) ? d.periods : []).forEach((p: any) => allPeriods.push({ day: d.day, ...p }));
  });

  const getDayPeriodsSorted = (day: string) => {
    const d = viewSchedule.find((s: any) => String(s?.day) === String(day));
    const periods = Array.isArray(d?.periods) ? [...d.periods] : [];
    periods.sort((a: any, b: any) => {
      const sa = toTimeStr(a?.start_time);
      const sb = toTimeStr(b?.start_time);
      if (sa && sb && sa !== sb) return sa.localeCompare(sb);
      return Number(a?.period_number) - Number(b?.period_number);
    });
    return periods;
  };

  const getAllSlotsForView = () => {
    const map = new Map<number, any>();
    const mondayPeriods = getDayPeriodsSorted('Monday');

    mondayPeriods.forEach((p: any) => {
      const pn = Number(p?.period_number);
      if (!pn) return;
      map.set(pn, {
        periodNumber: pn,
        startTime: toTimeStr(p?.start_time),
        endTime: toTimeStr(p?.end_time),
      });
    });

    shiftBreakTimes.forEach((t: any) => {
      if (String(t?.shift_name) !== String(shift)) return;
      const pn = Number(t?.break_period_after);
      if (!pn) return;
      const s = toTimeStr(t?.break_start_time);
      const e = toTimeStr(t?.break_end_time);
      if (s && e) {
        map.set(pn + 0.5, { isBreak: true, breakName: t.break_name, startTime: s, endTime: e });
      }
    });

    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]).map(([, v]) => v);
  };

  const allSlots = getAllSlotsForView();

  const periodColors = [
    { bg: '#e6f0f9', border: '#0087BE', text: '#002B5B' },
    { bg: '#eaf0f7', border: '#2D54A8', text: '#1a3060' },
    { bg: '#D1F4E8', border: '#10B981', text: '#065F46' },
    { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' },
    { bg: '#FEE2E2', border: '#EF4444', text: '#991B1B' },
  ];

  const getColorForSubject = (index: number) => periodColors[index % periodColors.length];

  const selectedDayPeriods = getDayPeriodsSorted(selectedDay);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0F2F5' }}>
      {/* Header & Stats Unified Container - Mobile Only */}
      <div className="w-full bg-[#002B5B] shadow-sm p-4 mb-6 md:hidden" style={{ background: 'linear-gradient(135deg, #002B5B 0%)' }}>
        <div className="w-full px-2 md:px-4 lg:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white">Class Timetable</h1>
              <p className="text-[10px] mt-0.5 font-medium text-blue-100/80 uppercase tracking-wider">View your weekly class schedule</p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header - Original Style */}
      <div className="hidden md:block w-full px-4 py-4 lg:px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">Class Timetable</h1>
              <p className="text-sm font-medium text-gray-500">View your weekly class schedule</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-2 pb-3 md:px-4 md:pb-4 lg:px-6">

        {/* Desktop View - Grid Table */}
        {!isMobile ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#002B5B]">
                    <th className="px-4 py-3 text-white text-[10px] font-bold uppercase tracking-widest text-left border-b border-blue-800">Time Slot</th>
                    {days.map(day => (
                      <th key={day} className="px-4 py-3 text-white text-[10px] font-bold uppercase tracking-widest text-left border-b border-blue-800">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {allSlots.map((slot: any, slotIdx: number) => (
                    <tr key={slotIdx} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-4 py-4 border-r border-gray-50 bg-gray-50/30">
                        {slot.isBreak ? (
                          <div className="flex items-center gap-2">
                            <AlertCircle size={14} className="text-orange-500" />
                            <span className="text-[11px] font-bold text-gray-700 uppercase tracking-tight">{slot.breakName}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-blue-600" />
                            <span className="text-[11px] font-bold text-gray-700">{slot.startTime} - {slot.endTime}</span>
                          </div>
                        )}
                      </td>
                      {days.map(day => {
                        if (slot.isBreak) {
                          return (
                            <td key={day} className="px-4 py-4 bg-orange-50/30">
                              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Break</span>
                            </td>
                          );
                        }

                        const dayPeriods = getDayPeriodsSorted(day);
                        const period = dayPeriods.find(p => Number(p?.period_number) === slot.periodNumber);

                        if (!period) {
                          return (
                            <td key={day} className="px-4 py-4 bg-gray-50/10" />
                          );
                        }

                        return (
                          <td key={day} className="px-3 py-3">
                            <div className="p-2.5 rounded-xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-sm transition-all duration-200">
                              <p className="font-bold text-[12px] text-gray-900 uppercase tracking-tight leading-tight mb-1 truncate">
                                {period.subject_code || 'N/A'}
                              </p>
                              <p className="text-[9px] font-bold text-gray-400 uppercase truncate">
                                {period.teacher_name || 'TBA'}
                              </p>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Mobile View - Day Selector */
          <div className="space-y-4 mb-6">
            {/* Day Selector */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 overflow-hidden">
              <div className="flex gap-1">
                {days.map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-1 py-2 rounded-xl font-bold text-[9px] uppercase tracking-widest transition-all flex-1 text-center ${
                      selectedDay === day 
                        ? 'bg-[#002B5B] text-white shadow-md' 
                        : 'bg-white text-gray-400 border border-transparent'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Periods for Selected Day */}
            <div className="space-y-2">
              {selectedDayPeriods.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                  <AlertCircle size={32} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">No classes scheduled for {selectedDay}</p>
                </div>
              ) : (
                selectedDayPeriods.map((period: any, idx: number) => {
                  const breakTime = shiftBreakTimes.find(
                    t => String(t?.shift_name) === String(shift) &&
                         Number(t?.break_period_after) === Number(period?.period_number)
                  );

                  return (
                    <React.Fragment key={period._id || idx}>
                      <div className="rounded-xl border border-gray-100 p-3 shadow-sm transition-all relative overflow-hidden bg-white">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#002B5B]"></div>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="bg-blue-50 text-[#002B5B] px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">
                                P{period.period_number}
                              </span>
                              <h3 className="font-bold text-[11px] text-gray-900 uppercase tracking-tight truncate">
                                {period.subject_code || 'N/A'}
                              </h3>
                            </div>
                            <p className="text-[9px] font-medium text-gray-500 flex items-center gap-1.5">
                              <Navigation2 size={8} className="text-gray-400" />
                              {period.teacher_name || 'TBA'}
                            </p>
                          </div>
                          <div className="shrink-0">
                            <div className="bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 flex items-center gap-1">
                              <Clock size={8} className="text-[#002B5B]" />
                              <span className="text-[9px] font-bold text-gray-700">
                                {toTimeStr(period?.start_time)} - {toTimeStr(period?.end_time)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {breakTime && (
                        <div className="bg-orange-50/50 rounded-xl border border-orange-100 p-2 shadow-sm mx-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-orange-500">
                              <AlertCircle size={12} />
                            </div>
                            <div className="flex-1 flex items-center justify-between">
                              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">
                                {breakTime.break_name}
                              </p>
                              <p className="text-[10px] font-bold text-orange-700">
                                {toTimeStr(breakTime?.break_start_time)} - {toTimeStr(breakTime?.break_end_time)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
};

export default StudentTimetable;