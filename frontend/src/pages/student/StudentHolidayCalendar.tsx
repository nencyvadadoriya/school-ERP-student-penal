import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaInfoCircle } from 'react-icons/fa';
import { Skeleton, CardSkeleton } from '../../components/Skeleton';
import { eventAPI } from '../../services/api';

const HolidayCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState<any[]>([]);
  const [customEvents, setCustomEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calendarific API Key (Ideally this should be in an env variable)
  const API_KEY = import.meta.env.VITE_CALENDARIFIC_API_KEY || 'YOUR_CALENDARIFIC_API_KEY';
  const COUNTRY = 'IN'; // Default to India
  const YEAR = currentDate.getFullYear();

  const fetchHolidays = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch public holidays for the current year
      let publicHolidays: any[] = [];
      if (API_KEY && API_KEY !== 'YOUR_CALENDARIFIC_API_KEY' && API_KEY !== 'YOUR_CALENDARIFIC_API_KEY_HERE') {
        try {
          const response = await fetch(`https://calendarific.com/api/v2/holidays?&api_key=${API_KEY}&country=${COUNTRY}&year=${YEAR}`);
          const data = await response.json();
          if (data.response && data.response.holidays) {
            publicHolidays = data.response.holidays;
          }
        } catch (err) {
          console.error('Error fetching public holidays:', err);
        }
      }

      // 2. Fetch custom events from our backend
      const customResponse = await eventAPI.getAll();
      const customData = customResponse.data.data || [];

      setHolidays(publicHolidays);
      setCustomEvents(customData);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Error connecting to services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, [YEAR]); // Refetch when the year changes

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    const days = [];

    // Empty slots for previous month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-[100px] sm:min-h-[120px] border-r border-b border-gray-100 bg-white/50"></div>);
    }

    // Days of the current month
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayHolidays = holidays.filter(h => h.date.iso === dateStr);
      const dayCustomEvents = customEvents.filter(e => {
        const eDate = e.event_date ? e.event_date.split('T')[0] : '';
        return eDate === dateStr;
      });
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

      days.push(
        <div
          key={day}
          className={`min-h-[100px] sm:min-h-[120px] p-2 border-r border-b border-gray-100 transition-all relative group overflow-hidden ${
            isToday ? 'bg-orange-50/20' : 'bg-white hover:bg-gray-50/50'
          }`}
        >
          <div className="flex justify-start items-start">
            <span className={`text-[11px] font-semibold ${isToday ? 'text-orange-600' : 'text-gray-900'}`}>
              {day}
            </span>
          </div>
          <div className="mt-2 space-y-1">
            {dayHolidays.map((h, idx) => (
              <div
                key={`pub-${idx}`}
                className="text-[9px] leading-tight px-2 py-1 bg-blue-50/80 text-blue-700 rounded-sm font-medium uppercase tracking-tight truncate border-l-2 border-blue-400"
                title={h.name}
              >
                {h.name}
              </div>
            ))}
            {dayCustomEvents.map((e, idx) => (
              <div
                key={`custom-${idx}`}
                className="text-[9px] leading-tight px-2 py-1 bg-blue-50/80 text-blue-700 rounded-sm font-medium uppercase tracking-tight truncate border-l-2 border-blue-400"
                title={e.title}
              >
                {e.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0F2F5' }}>
      <div className="w-full px-2 py-3 md:px-4 md:py-4 lg:px-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-[#1e293b] tracking-tight ">Holiday Calendar</h1>
              <p className="text-[10px] font-medium text-gray-500 mt-0.5 uppercase tracking-wider">View upcoming holidays and school breaks</p>
            </div>
            <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-gray-100 self-start sm:self-auto">
              <button onClick={prevMonth} className="w-7 h-7 flex items-center justify-center bg-white hover:bg-gray-100 rounded-md shadow-sm border border-gray-200 transition-all text-gray-500 active:scale-95">
                <FaChevronLeft size={10} />
              </button>
              <span className="px-4 py-1 text-[10px] font-bold text-gray-900 min-w-[100px] text-center uppercase tracking-widest">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <button onClick={nextMonth} className="w-7 h-7 flex items-center justify-center bg-white hover:bg-gray-100 rounded-md shadow-sm border border-gray-200 transition-all text-gray-500 active:scale-95">
                <FaChevronRight size={10} />
              </button>
            </div>
          </div>
        </div>

        {/* Info Notice */}
        <div className="mb-6">
          <div className="bg-[#FFF8F1] border border-[#FFE7D1] text-[#A35200] px-4 py-2.5 rounded-md flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wider shadow-sm">
            <FaInfoCircle className="flex-shrink-0 text-orange-400" size={14} />
            <p>School calendar is active. Public holidays may vary by region.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="grid grid-cols-7 bg-[#FDFDFD]">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
              <div key={day} className="py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {loading ? (
            <div className="p-4">
              <div className="grid grid-cols-7 gap-px bg-gray-100">
                {Array.from({ length: 35 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 sm:h-32 w-full" />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-7 border-t border-l border-gray-100">
              {renderCalendar()}
            </div>
          )}
        </div>

        {/* Events List for Month */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-tight">
            <div className="w-1 h-5 bg-[#002B5B] rounded-full"></div>
            Events in {monthNames[currentDate.getMonth()]}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {holidays
              .filter(h => {
                const d = new Date(h.date.iso);
                return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
              })
              .map((h, idx) => (
                <div key={`list-pub-${idx}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-transparent hover:border-red-100 hover:bg-white hover:shadow-md transition-all duration-300">
                  <div className="bg-white w-10 h-10 rounded-lg flex flex-col items-center justify-center shadow-sm border border-gray-100 text-red-500 shrink-0">
                    <span className="text-[8px] font-black uppercase tracking-tighter">{monthNames[new Date(h.date.iso).getMonth()].slice(0, 3)}</span>
                    <span className="text-base font-black leading-none">{new Date(h.date.iso).getDate()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-gray-900 leading-tight uppercase truncate">{h.name}</p>
                    <p className="text-[8px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest">{h.type?.[0] || 'Public Holiday'}</p>
                  </div>
                </div>
              ))}

            {customEvents
              .filter(e => {
                const d = e.event_date ? new Date(e.event_date) : null;
                return d && d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
              })
              .map((e, idx) => (
                <div key={`list-custom-${idx}`} className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-md transition-all duration-300">
                  <div className="bg-white w-10 h-10 rounded-lg flex flex-col items-center justify-center shadow-sm border border-gray-100 text-blue-600 shrink-0">
                    <span className="text-[8px] font-black uppercase tracking-tighter">{e.event_date ? monthNames[new Date(e.event_date).getMonth()].slice(0, 3) : '---'}</span>
                    <span className="text-base font-black leading-none">{e.event_date ? new Date(e.event_date).getDate() : '--'}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-gray-900 leading-tight uppercase truncate">{e.title}</p>
                    <p className="text-[8px] font-bold text-[#002B5B] mt-0.5 uppercase tracking-widest">School Event</p>
                  </div>
                </div>
              ))}

            {holidays.filter(h => {
              const d = new Date(h.date.iso);
              return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
            }).length === 0 && customEvents.filter(e => {
              const d = new Date(e.event_date);
              return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
            }).length === 0 && (
              <div className="col-span-full py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">No holidays scheduled</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidayCalendar;
