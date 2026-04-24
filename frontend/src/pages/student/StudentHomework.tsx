import React, { useState, useEffect } from 'react';
import { homeworkAPI } from '../../services/api';
import { Skeleton, CardSkeleton } from '../../components/Skeleton';
import { useAuth } from '../../context/AuthContext';

const StudentHomework: React.FC = () => {
  const { user } = useAuth();
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
        className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200 relative overflow-hidden group"
        style={{ borderLeft: `4px solid ${themeColor}` }}
      >
        <div className="flex justify-between items-start gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span 
                className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
              >
                {hw.subject_code}
              </span>
            </div>
            <h3 className="text-[14px] font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors">
              {hw.title}
            </h3>
          </div>
          <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 border ${
            isPending 
              ? 'bg-blue-50 text-blue-600 border-blue-100' 
              : 'bg-gray-50 text-gray-500 border-gray-100'
          }`}>
            Due: {new Date(hw.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </div>
        </div>
        
        {hw.description && (
          <div className="bg-gray-50/80 rounded-lg p-3 mb-4 border border-gray-100">
            <p className="text-[12px] text-gray-600 font-medium leading-relaxed line-clamp-3">
              {hw.description}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100/80">
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: themeColor }}
            ></div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              {isPending ? 'Active' : 'Completed'}
            </span>
          </div>
          <button 
            className="text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 group/btn"
            style={{ color: themeColor }}
          >
            <span>View Details</span>
            <svg className="w-3 h-3 transform group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0F2F5' }}>
      <div className="w-full px-2 py-3 md:px-4 md:py-4 lg:px-6">
        {/* Header & Stats Unified Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Homework</h1>
              <p className="text-[10px] mt-0.5 font-medium text-gray-500">Manage your assignments and tasks</p>
            </div>
            <div className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-xl border border-gray-100 shadow-sm self-start sm:self-auto">
              <div className="flex flex-col items-end px-3">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Pending</span>
                <span className="text-sm font-bold text-blue-600 leading-none">{pending.length}</span>
              </div>
              <div className="w-px h-6 bg-gray-200"></div>
              <div className="flex flex-col items-end px-3">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Total</span>
                <span className="text-sm font-bold text-gray-900 leading-none">{items.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Pending Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
              <h2 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">Active Assignments</h2>
            </div>
            
            {pending.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center border border-gray-200 shadow-sm">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3 text-green-500">
                  <span className="text-xl">🎉</span>
                </div>
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
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <div className="w-1 h-5 bg-gray-400 rounded-full"></div>
                <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Past Assignments</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
