import React, { useState, useEffect } from 'react';
import { FaSearch, FaCalendarAlt, FaClock, FaBook, FaInfoCircle, FaClipboardList } from 'react-icons/fa';
import { examAPI } from '../../services/api';
import { Skeleton, CardSkeleton } from '../../components/Skeleton';
import { useAuth } from '../../context/AuthContext';

const StudentExams: React.FC = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setError('');
        if (!user?.class_code) {
          setExams([]);
          setError('Class not found for this student. Please contact admin.');
          return;
        }
        const r = await examAPI.getAll({ class_code: user.class_code });
        setExams(r.data.data || []);
      } catch (e) {
        console.error('Failed to fetch exams', e);
        setError('Failed to load exams. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, [user?.class_code]);

  const filtered = exams.filter(e => 
    e.exam_name?.toLowerCase().includes(search.toLowerCase()) || 
    e.subject_code?.toLowerCase().includes(search.toLowerCase()) ||
    e.exam_type?.toLowerCase().includes(search.toLowerCase())
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = exams.filter(e => new Date(e.exam_date) >= today);

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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 mb-6">
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  const typeColors: any = { 
    'Unit Test': 'bg-blue-100 text-blue-700',
    'Mid Term': 'bg-yellow-100 text-yellow-700',
    'Final': 'bg-red-100 text-red-700',
    'Practical': 'bg-green-100 text-green-700',
    'Assignment': 'bg-purple-100 text-purple-700' 
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0F2F5' }}>
      <div className="w-full px-2 py-3 md:px-4 md:py-4 lg:px-6">
        {/* Header & Stats Unified Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Upcoming Exams</h1>
              <p className="text-[10px] mt-0.5 font-medium text-gray-500">View your exam schedule and details</p>
            </div>
            <div className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-xl border border-gray-100 shadow-sm self-start sm:self-auto">
              <div className="flex flex-col items-end px-3">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Upcoming</span>
                <span className="text-sm font-bold text-blue-600 leading-none">{upcoming.length}</span>
              </div>
              <div className="w-px h-6 bg-gray-200"></div>
              <div className="flex flex-col items-end px-3">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Total</span>
                <span className="text-sm font-bold text-gray-900 leading-none">{exams.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 mb-6">
          <div className="relative group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-2.5 pl-11 pr-4 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-blue-600 transition-all" 
              placeholder="Search exams, subjects, or types..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-xs font-semibold text-red-600 mb-6 flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
            <h2 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">Exam Schedule</h2>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClipboardList className="text-gray-300 text-2xl" />
              </div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">No exams found matching your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(ex => (
                <div key={ex._id} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 relative">
                  <div className={`h-1.5 ${typeColors[ex.exam_type]?.split(' ')[0] || 'bg-blue-600'}`} />
                  <div className="p-4">
                    <div className="flex justify-between items-start gap-3 mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${typeColors[ex.exam_type] || 'bg-blue-50 text-blue-600'}`}>
                            {ex.exam_type}
                          </span>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-gray-100 text-gray-600">
                            {ex.subject_code}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-[14px] leading-tight group-hover:text-blue-600 transition-colors truncate">
                          {ex.exam_name}
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50/50 p-2 rounded-lg border border-gray-50">
                        <div className="flex items-center gap-2 mb-1">
                          <FaCalendarAlt className="w-2.5 h-2.5 text-blue-600" />
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Date</span>
                        </div>
                        <span className="text-[11px] font-bold text-gray-700">
                          {new Date(ex.exam_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <div className="bg-gray-50/50 p-2 rounded-lg border border-gray-50">
                        <div className="flex items-center gap-2 mb-1">
                          <FaClock className="w-2.5 h-2.5 text-orange-600" />
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Time</span>
                        </div>
                        <span className="text-[11px] font-bold text-gray-700 truncate">
                          {ex.start_time || '—'} - {ex.end_time || '—'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-blue-50/30 rounded-xl border border-blue-50/50">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-sm">
                          <FaInfoCircle className="w-3 h-3 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Total Marks</p>
                          <p className="text-[11px] font-bold text-gray-900 leading-none">{ex.total_marks}</p>
                        </div>
                      </div>
                      <div className="h-6 w-px bg-blue-100"></div>
                      <div className="text-right">
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Pass Marks</p>
                        <p className="text-[11px] font-bold text-blue-600 leading-none">{ex.passing_marks}</p>
                      </div>
                    </div>

                    {ex.description && (
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <p className="text-[12px] text-gray-500 font-medium leading-relaxed italic line-clamp-2">
                          "{ex.description}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentExams;
