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
      <div className="w-full px-2 py-3 md:px-4 md:py-4 lg:px-6">
        {/* Header & Stats Unified Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Leave Applications</h1>
              <p className="text-[10px] mt-0.5 font-medium text-gray-500">Manage and track your leave requests</p>
            </div>
            <div className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-xl border border-gray-100 shadow-sm self-start sm:self-auto">
              <div className="flex flex-col items-end px-3">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Approved</span>
                <span className="text-sm font-bold text-green-600 leading-none">{leaves.filter(l => l.status?.toLowerCase() === 'approved').length}</span>
              </div>
              <div className="w-px h-6 bg-gray-200"></div>
              <div className="flex flex-col items-end px-3">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Pending</span>
                <span className="text-sm font-bold text-orange-500 leading-none">{leaves.filter(l => l.status?.toLowerCase() === 'pending').length}</span>
              </div>
              <div className="w-px h-6 bg-gray-200"></div>
              <div className="flex flex-col items-end px-3">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Total</span>
                <span className="text-sm font-bold text-gray-900 leading-none">{leaves.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-1 bg-white p-1 rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
            {['all', 'pending', 'approved', 'rejected'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg font-bold text-[11px] uppercase tracking-widest transition-all whitespace-nowrap ${
                  filter === f 
                    ? 'bg-[#002B5B] text-white shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setModal(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white transition-all duration-200 bg-[#002B5B] hover:bg-[#002B5B] shadow-sm active:scale-95 text-[12px] uppercase tracking-widest"
          >
            <Plus size={16} strokeWidth={3} />
            <span>Apply Leave</span>
          </button>
        </div>

        {/* Leaves List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1 h-5 bg-[#002B5B] rounded-full"></div>
            <h2 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">Application History</h2>
          </div>

          {filteredLeaves.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={28} className="text-gray-300" />
              </div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">No {filter !== 'all' ? filter : ''} leave applications found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredLeaves.map(leave => (
                <div 
                  key={leave._id}
                  className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span 
                          className="px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest"
                          style={{
                            backgroundColor: leave.leave_type === 'Medical' ? '#D1F4E8' : '#FEF3C7',
                            color: leave.leave_type === 'Medical' ? '#10B981' : '#F59E0B'
                          }}
                        >
                          {leave.leave_type}
                        </span>
                        <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
                          {getStatusIcon(leave.status)}
                          <Badge status={leave.status} />
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900 text-[14px] uppercase tracking-tight mb-2 group-hover:text-blue-600 transition-colors">
                        {leave.reason}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <Calendar size={12} className="text-blue-600" />
                          <span className="text-[11px] font-bold uppercase tracking-tight">
                            {new Date(leave.from_date).toLocaleDateString()} - {new Date(leave.to_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <Clock size={12} className="text-orange-500" />
                          <span className="text-[11px] font-bold uppercase tracking-tight">
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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50"
          onClick={() => setModal(false)}
        >
          <div 
            className="bg-white w-full md:max-w-md rounded-t-2xl md:rounded-xl shadow-lg md:shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: theme.textPrimary }}>
              Apply for Leave
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Leave Type */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.textPrimary }}>
                  Leave Type
                </label>
                <select
                  value={form.leave_type}
                  onChange={(e) => setForm({ ...form, leave_type: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none transition-all"
                  style={{
                    borderColor: '#E5E7EB',
                    color: theme.textPrimary
                  }}
                  onFocus={(e) => e.target.style.borderColor = theme.primary}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                >
                  {leaveTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* From Date */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.textPrimary }}>
                  From Date
                </label>
                <input
                  type="date"
                  value={form.from_date}
                  onChange={(e) => setForm({ ...form, from_date: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none transition-all"
                  style={{
                    borderColor: '#E5E7EB',
                    color: theme.textPrimary
                  }}
                  required
                  onFocus={(e) => e.target.style.borderColor = theme.primary}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>

              {/* To Date */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.textPrimary }}>
                  To Date
                </label>
                <input
                  type="date"
                  value={form.to_date}
                  onChange={(e) => setForm({ ...form, to_date: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none transition-all"
                  style={{
                    borderColor: '#E5E7EB',
                    color: theme.textPrimary
                  }}
                  required
                  onFocus={(e) => e.target.style.borderColor = theme.primary}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.textPrimary }}>
                  Reason
                </label>
                <textarea
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Enter reason for leave"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none transition-all resize-none"
                  rows={4}
                  style={{
                    borderColor: '#E5E7EB',
                    color: theme.textPrimary
                  }}
                  required
                  onFocus={(e) => e.target.style.borderColor = theme.primary}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg font-medium border transition-all"
                  style={{
                    borderColor: '#E5E7EB',
                    color: theme.textSecondary
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg font-medium text-white transition-all hover:shadow-lg active:scale-95"
                  style={{ backgroundColor: theme.primary }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentLeave;