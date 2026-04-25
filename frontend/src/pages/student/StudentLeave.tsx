import React, { useState, useEffect } from 'react';
import { 
  Calendar, Plus, CheckCircle2, Clock, XCircle, AlertCircle,
  ChevronRight, Filter, Trash2
} from 'lucide-react';
import { leaveAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Skeleton, CardSkeleton } from '../../components/Skeleton';
import Badge from '../../components/Badge';
import { toast } from 'react-toastify';

const StudentLeave: React.FC = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modal, setModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [form, setForm] = useState({
    leave_type: 'Personal',
    from_date: '',
    to_date: '',
    reason: '',
  });

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

  const leaveTypes = ['Personal', 'Medical', 'Emergency', 'Other'];

  useEffect(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const checkMobile = () => setIsMobile(window.innerWidth < 768);

  const fetchLeaves = async () => {
    try {
      if (user?.gr_number) {
        const r = await leaveAPI.getStudentLeaves({ gr_number: user.gr_number });
        setLeaves(r.data.data || []);
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to fetch leaves');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.from_date || !form.to_date || !form.reason) {
      toast.error('Please fill all fields');
      return;
    }

    if (new Date(form.from_date) > new Date(form.to_date)) {
      toast.error('From date must be before To date');
      return;
    }

    try {
      const payload = {
        ...form,
        student_id: user.id,
        gr_number: user.gr_number,
        student_name: `${user.first_name} ${user.last_name}`,
        class_code: user.class_code,
      };
      await leaveAPI.applyStudent(payload);
      toast.success('Leave applied successfully');
      setModal(false);
      setForm({ leave_type: 'Personal', from_date: '', to_date: '', reason: '' });
      fetchLeaves();
    } catch (e) {
      toast.error('Failed to apply leave');
      console.error(e);
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'approved':
        return <CheckCircle2 size={18} style={{ color: theme.success }} />;
      case 'pending':
        return <Clock size={18} style={{ color: theme.warning }} />;
      case 'rejected':
        return <XCircle size={18} style={{ color: theme.danger }} />;
      default:
        return <AlertCircle size={18} style={{ color: theme.textSecondary }} />;
    }
  };

  const filteredLeaves = filter === 'all' 
    ? leaves 
    : leaves.filter(l => l.status?.toLowerCase() === filter.toLowerCase());

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
                <Skeleton className="h-10 w-16 rounded-xl" />
                <Skeleton className="h-10 w-16 rounded-xl" />
                <Skeleton className="h-10 w-16 rounded-xl" />
              </div>
            </div>
          </div>
          <div className="flex justify-between gap-4 mb-6">
            <Skeleton className="h-10 w-64 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0F2F5' }}>
      {/* Header & Stats Unified Container - Mobile Only */}
      <div className="w-full bg-[#002B5B] shadow-sm p-4 mb-6 md:hidden" style={{ background: 'linear-gradient(135deg, #002B5B 0%' }}>
        <div className="w-full px-2 md:px-4 lg:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white">Leave Applications</h1>
              <p className="text-[10px] mt-0.5 font-medium text-blue-100/80 uppercase tracking-wider">Manage and track your leave requests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header - Original Style */}
      <div className="hidden md:block w-full px-4 py-4 lg:px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">Leave Applications</h1>
              <p className="text-sm font-medium text-gray-500">Manage and track your leave requests</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-2 pb-3 md:px-4 md:pb-4 lg:px-6">

        {/* Action & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-1 md:gap-2 bg-white p-1 md:p-1.5 rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {['all', 'pending', 'approved', 'rejected'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-1 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-[8px] md:text-[10px] uppercase tracking-widest transition-all flex-1 md:min-w-[80px] text-center ${
                  filter === f 
                    ? 'bg-[#002B5B] text-white shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 md:px-6 md:py-2.5 rounded-xl font-bold text-white transition-all duration-200 bg-[#002B5B] hover:bg-[#002B5B]/90 shadow-md active:scale-95 text-[10px] md:text-[11px] uppercase tracking-widest w-full sm:w-auto"
          >
            <Plus size={14} md:size={16} strokeWidth={3} />
            <span>Apply Leave</span>
          </button>
        </div>

        {/* Leaves List */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1 h-4 bg-[#002B5B] rounded-full"></div>
            <h2 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Application History</h2>
          </div>

          {filteredLeaves.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar size={20} className="text-gray-300" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">No {filter !== 'all' ? filter : ''} leave applications found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {filteredLeaves.map(leave => (
                <div 
                  key={leave._id}
                  className="bg-white rounded-2xl border border-gray-100 p-3 hover:shadow-md transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#002B5B]"></div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0 pl-1">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span 
                          className="px-1.5 py-0.5 rounded-lg text-[7px] font-bold uppercase tracking-widest"
                          style={{
                            backgroundColor: leave.leave_type === 'Medical' ? '#D1F4E8' : '#FEF3C7',
                            color: leave.leave_type === 'Medical' ? '#10B981' : '#F59E0B'
                          }}
                        >
                          {leave.leave_type}
                        </span>
                        <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded-lg border border-gray-100 scale-90 origin-left">
                          {getStatusIcon(leave.status)}
                          <Badge status={leave.status} />
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900 text-[11px] uppercase tracking-tight mb-1.5 group-hover:text-[#002B5B] transition-colors line-clamp-1">
                        {leave.reason}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1 text-gray-400">
                          <Calendar size={8} className="text-[#002B5B]" />
                          <span className="text-[9px] font-bold uppercase tracking-tight">
                            {new Date(leave.from_date).toLocaleDateString()} - {new Date(leave.to_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Clock size={8} className="text-orange-500" />
                          <span className="text-[9px] font-bold uppercase tracking-tight">
                            {Math.ceil((new Date(leave.to_date).getTime() - new Date(leave.from_date).getTime()) / (1000 * 60 * 60 * 24)) + 1} Days
                          </span>
                        </div>
                      </div>
                    </div>
                   
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-end md:items-center justify-center z-[100]"
          onClick={() => setModal(false)}
        >
          <div 
            className="bg-[#F8FAFC] w-full md:max-w-md rounded-t-[2rem] md:rounded-3xl shadow-2xl flex flex-col max-h-[95vh] relative animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Handle */}
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3 md:hidden shrink-0"></div>

            {/* Header */}
            <div className="px-5 py-3 flex items-center justify-between shrink-0 bg-white rounded-t-[2rem] md:rounded-t-3xl border-b border-gray-100">
              <div>
                <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">
                  Apply Leave
                </h2>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  Fill in the details below
                </p>
              </div>
              <button 
                onClick={() => setModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle size={16} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <div className="p-4 space-y-4">
                  {/* Leave Type Section */}
                  <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm space-y-3">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className="w-1 h-1 bg-[#002B5B] rounded-full"></div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Leave Info</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1 ml-0.5">
                          Leave Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={form.leave_type}
                          onChange={(e) => setForm({ ...form, leave_type: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002B5B]/10 transition-all appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:0.8em_0.8em] bg-white font-medium text-gray-700"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          }}
                        >
                          {leaveTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-1">
                        <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1 ml-0.5">
                          From Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={form.from_date}
                          onChange={(e) => setForm({ ...form, from_date: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002B5B]/10 transition-all bg-white font-medium text-gray-700"
                          required
                        />
                      </div>

                      <div className="col-span-1">
                        <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1 ml-0.5">
                          To Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={form.to_date}
                          onChange={(e) => setForm({ ...form, to_date: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002B5B]/10 transition-all bg-white font-medium text-gray-700"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reason Section */}
                  <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm space-y-3">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className="w-1 h-1 bg-[#002B5B] rounded-full"></div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Application Details</span>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1 ml-0.5">
                        Reason <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={form.reason}
                        onChange={(e) => setForm({ ...form, reason: e.target.value })}
                        placeholder="Enter reason"
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002B5B]/10 transition-all resize-none min-h-[80px] bg-white font-medium text-gray-700"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 bg-white border-t border-gray-100 shrink-0 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setModal(false)}
                    className="flex-1 px-3 py-2.5 rounded-lg font-bold text-[9px] uppercase tracking-widest border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-3 py-2.5 rounded-lg font-bold text-[9px] uppercase tracking-widest text-white bg-[#002B5B] hover:bg-[#002B5B]/90 shadow-sm active:scale-95 transition-all"
                  >
                    Apply
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentLeave;