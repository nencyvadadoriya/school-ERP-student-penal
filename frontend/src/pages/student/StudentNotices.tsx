import React, { useState, useEffect } from 'react';
import { noticeAPI, eventAPI } from '../../services/api';
import Badge from '../../components/Badge';
import { Skeleton, CardSkeleton } from '../../components/Skeleton';
import { FaBell, FaCalendarAlt } from 'react-icons/fa';

const StudentNotices: React.FC = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [tab, setTab] = useState<string>('notices');

  useEffect(()=>{
    Promise.all([noticeAPI.getAll({}),eventAPI.getAll()])
      .then(([n,e])=>{ setNotices(n.data.data||[]); setEvents(e.data.data||[]); })
      .catch(console.error)
      .finally(()=>setLoading(false));
  },[]);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F0F2F5' }}>
        <div className="w-full px-2 py-3 md:px-4 md:py-4 lg:px-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-48 rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0F2F5' }}>
      <div className="w-full px-2 py-3 md:px-4 md:py-4 lg:px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold text-[#1e293b] tracking-tight">Notices & Events</h1>
              <p className="text-xs font-medium text-gray-500 mt-1">Stay updated with latest school news</p>
            </div>
            
            <div className="inline-flex p-1 bg-gray-100 rounded-xl self-start sm:self-auto border border-gray-200/50">
              <button 
                onClick={() => setTab('notices')} 
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                  tab === 'notices' 
                    ? 'bg-white shadow-sm text-[#002B5B]' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Notices ({notices.length})
              </button>
              <button 
                onClick={() => setTab('events')} 
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                  tab === 'events' 
                    ? 'bg-white shadow-sm text-[#002B5B]' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Events ({events.length})
              </button>
            </div>
          </div>
        </div>

        <div className="min-h-[400px]">
          {tab === 'notices' ? (
            <div className="space-y-4">
              {notices.length === 0 ? (
                <div className="bg-white rounded-2xl p-20 text-center shadow-sm border border-gray-100">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200">
                    <FaBell className="text-3xl" />
                  </div>
                  <p className="text-sm font-medium text-gray-400">No notices available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {notices.map(n => (
                    <div key={n._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all duration-300 flex flex-col">
                      <div className="h-1 bg-[#002B5B]"></div>
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start gap-4 mb-3">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-[#002B5B] uppercase tracking-widest">
                              {new Date(n.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </span>
                            <h3 className="font-bold text-gray-900 text-sm mt-1 uppercase tracking-tight line-clamp-1 group-hover:text-[#002B5B] transition-colors">{n.title}</h3>
                          </div>
                          <Badge status={n.priority} />
                        </div>
                        <p className="text-[12px] text-gray-600 font-medium leading-relaxed line-clamp-4 flex-1 mb-4">{n.content}</p>
                        <div className="pt-3 border-t border-gray-50">
                         
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {events.length === 0 ? (
                <div className="bg-white rounded-2xl p-20 text-center shadow-sm border border-gray-100">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200">
                    <FaCalendarAlt className="text-3xl" />
                  </div>
                  <p className="text-sm font-medium text-gray-400">No events scheduled</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {events.map(ev => (
                    <div key={ev._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all duration-300 flex flex-col">
                      <div className="h-1 bg-[#002B5B]"></div>
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start gap-4 mb-3">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-[#002B5B] uppercase tracking-widest">{new Date(ev.event_date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}</span>
                            <h3 className="font-bold text-gray-900 text-sm mt-1 leading-tight group-hover:text-[#002B5B] transition-colors">{ev.title}</h3>
                          </div>
                          <span className="bg-blue-50 text-[#002B5B] px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-blue-100 shrink-0">{ev.event_type}</span>
                        </div>
                        {ev.description && <p className="text-[12px] text-gray-500 font-medium leading-relaxed line-clamp-2 mb-4">{ev.description}</p>}
                        <div className="flex flex-wrap items-center gap-4 mt-auto pt-3 border-t border-gray-50">
                          {ev.location && (
                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                              <span className="text-blue-500">📍</span> {ev.location}
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                            <span className="text-blue-500">⏰</span> {new Date(ev.event_date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentNotices;
