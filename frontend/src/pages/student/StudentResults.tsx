import React, { useState, useEffect } from 'react';
import { examAPI } from '../../services/api';
import { Skeleton, CardSkeleton, TableRowSkeleton } from '../../components/Skeleton';
import { useAuth } from '../../context/AuthContext';
import { FaFileAlt } from 'react-icons/fa';

const StudentResults: React.FC = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(()=>{
    examAPI.getResults({ gr_number: user?.gr_number })
      .then(r=>setResults(r.data.data||[]))
      .catch(console.error)
      .finally(()=>setLoading(false));
  },[]);

  const gradeColor = { 'A+':'text-green-700 bg-green-100','A':'text-green-600 bg-green-50','B':'text-blue-600 bg-blue-50','C':'text-yellow-600 bg-yellow-50','D':'text-orange-600 bg-orange-50','E':'text-orange-700 bg-orange-100','F':'text-red-600 bg-red-50' };

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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <th key={i} className="px-6 py-4"><Skeleton className="h-4 w-20" /></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRowSkeleton key={i} columns={5} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0F2F5' }}>
      <div className="w-full px-2 py-3 md:px-4 md:py-4 lg:px-6">
        {/* Header & Stats Unified Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">My Results</h1>
              <p className="text-[10px] mt-0.5 font-medium text-gray-500">Track your academic performance</p>
            </div>
            <div className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-xl border border-gray-100 shadow-sm self-start sm:self-auto">
              <div className="flex flex-col items-end px-3">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Published</span>
                <span className="text-sm font-bold text-blue-600 leading-none">{results.length}</span>
              </div>
              <div className="w-px h-6 bg-gray-200"></div>
              <div className="flex flex-col items-end px-3">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Academic Year</span>
                <span className="text-sm font-bold text-gray-900 leading-none">2026</span>
              </div>
            </div>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200">
              <FaFileAlt className="text-2xl" />
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">No results published yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
              <h2 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">Scorecard Details</h2>
            </div>

            {/* Mobile View: Result Cards */}
            <div className="md:hidden space-y-3">
              {results.map(r => {
                const pct = Math.round((r.marks_obtained / r.total_marks) * 100);
                return (
                  <div key={r._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group active:scale-[0.98] transition-all relative">
                    <div className={`h-1 ${pct >= 35 ? 'bg-blue-600' : 'bg-red-500'}`}></div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-4 gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{r.exam_id?.exam_type || 'EXAM'}</p>
                          <h3 className="text-[14px] font-bold text-gray-900 leading-tight uppercase tracking-tight truncate">{r.exam_id?.exam_name || '—'}</h3>
                        </div>
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest shrink-0 ${gradeColor[r.grade] || 'bg-gray-100 text-gray-700'}`}>
                          {r.grade}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 border-y border-gray-50 py-3 mb-3">
                        <div>
                          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Subject</p>
                          <p className="text-[12px] font-bold text-gray-900 mt-0.5 uppercase truncate">{r.subject_code}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Score</p>
                          <p className="text-[12px] font-bold text-gray-900 mt-0.5">
                            {r.marks_obtained}<span className="text-gray-400 font-medium">/{r.total_marks}</span>
                            <span className="ml-1 text-[10px] text-blue-600 font-bold">({pct}%)</span>
                          </p>
                        </div>
                      </div>

                      {r.remarks && (
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-blue-400 shrink-0"></div>
                          <p className="text-[11px] text-gray-500 font-medium italic truncate">"{r.remarks}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50 text-left">
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Exam Details</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Subject</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">Marks</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">Grade</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {results.map(r => (
                      <tr key={r._id} className="hover:bg-gray-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 text-[13px] uppercase tracking-tight">{r.exam_id?.exam_name || '—'}</div>
                          <div className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">{r.exam_id?.exam_type || '—'}</div>
                        </td>
                        <td className="px-6 py-4 text-[12px] font-bold text-gray-700 uppercase tracking-tight">{r.subject_code}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="text-[13px] font-bold text-gray-900">
                            {r.marks_obtained}<span className="text-gray-400 font-medium">/{r.total_marks}</span>
                          </div>
                          <div className="text-[10px] font-bold text-blue-600">{Math.round((r.marks_obtained / r.total_marks) * 100)}%</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${gradeColor[r.grade] || 'bg-gray-100 text-gray-700'}`}>
                            {r.grade}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-[11px] text-gray-500 font-medium italic line-clamp-1">{r.remarks || '—'}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentResults;
