import React, { useState, useEffect } from 'react';
import { homeworkAPI } from '../../services/api';
import { Skeleton, CardSkeleton } from '../../components/Skeleton';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader';

import { 
  BookOpen, ChevronRight, Calendar, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentHomework: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(()=>{
    if (!user?.class_code) return;
    setLoading(true);
    homeworkAPI.getAll({ class_code: user.class_code })
      .then(r=>setItems(r.data.data||[]))
      .catch(console.error)
      .finally(()=>setLoading(false));
  },[user?.class_code]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const pending = items.filter(h=>new Date(h.due_date)>=today);
  const past = items.filter(h=>new Date(h.due_date)<today);

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
          <div className="space-y-4">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const HWCard = ({hw}: {hw: any}) => {
    const isPending = new Date(hw.due_date) >= today;
    const themeColor = isPending ? '#2563eb' : '#9ca3af'; // blue-600 or gray-400

    return (
      <div 
        className="bg-white rounded-lg border border-gray-100 p-3 hover:shadow-sm transition-all duration-200 relative overflow-hidden group shadow-sm"
        style={{ borderLeft: `3px solid ${themeColor}` }}
      >
        <div className="flex justify-between items-start gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span 
                className="text-[9px] font-bold px-1.5 py-0 rounded-md uppercase tracking-wider"
                style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
              >
                {hw.subject_code}
              </span>
            </div>
            <h3 className="text-[13px] font-bold text-gray-800 leading-snug group-hover:text-blue-600 transition-colors">
              {hw.title}
            </h3>
          </div>
          <div className={`px-2 py-0.5 rounded text-[9px] font-bold shrink-0 border ${
            isPending 
              ? 'bg-blue-50 text-blue-600 border-blue-100' 
              : 'bg-gray-50 text-gray-500 border-gray-100'
          }`}>
            Due: {new Date(hw.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </div>
        </div>
        
        {hw.description && (
          <div className="bg-gray-50/50 rounded-lg p-2.5 mb-3 border border-gray-100">
            <p className="text-[11px] text-gray-600 font-medium leading-relaxed line-clamp-2">
              {hw.description}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <div 
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: themeColor }}
            ></div>
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
              {isPending ? 'Active' : 'Completed'}
            </span>
          </div>
          <button 
            className="text-[10px] font-bold px-3 py-1 rounded-md transition-all flex items-center gap-1 group/btn bg-gray-50 border border-gray-100 hover:bg-gray-100"
            style={{ color: themeColor }}
          >
            <span>View</span>
            <svg className="w-2.5 h-2.5 transform group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0" style={{ backgroundColor: '#F0F2F5' }}>
      {/* Mobile Header */}
      <div className="md:hidden bg-[#002B5B] pt-6 pb-8 px-4">
        <h1 className="text-lg font-bold text-white">Homework</h1>
        <p className="text-[10px] mt-0.5 text-white/80">Manage assignments and tasks</p>
      </div>

      <div className="w-full px-3 py-3 md:px-4 md:py-4 lg:px-6">
        {/* Desktop Header & Stats */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Homework</h1>
              <p className="text-[10px] mt-0.5 font-medium text-gray-500">Manage assignments and tasks</p>
            </div>
            <div className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-xl border border-gray-100 shadow-sm self-start sm:self-auto">
              <div className="flex flex-col items-end px-3">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Pending</span>
                <span className="text-sm font-bold text-blue-600 leading-none">{pending.length}</span>
              </div>
              <div className="w-px h-6 bg-gray-200"></div>
              <div className="flex flex-col items-end px-3">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Academic Year</span>
                <span className="text-sm font-bold text-gray-900 leading-none">2026</span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          {/* Pending Section */}
          <div className="space-y-3">            
            {pending.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center border border-gray-200 shadow-sm">
                
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">All caught up! No pending homework</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {pending.map(hw => <HWCard key={hw._id} hw={hw} />)}
              </div>
            )}
          </div>

          {/* Past Section */}
          {past.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <div className="w-0.5 h-4 bg-gray-400 rounded-full"></div>
                <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Past Assignments</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {past.map(hw => <HWCard key={hw._id} hw={hw} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentHomework;
