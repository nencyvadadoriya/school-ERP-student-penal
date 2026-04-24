import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaSchool, FaUserGraduate, FaChalkboardTeacher, FaLock, FaKey, FaCamera, FaTrashAlt } from 'react-icons/fa';
import { studentAPI } from '../services/api';
import { Skeleton, CardSkeleton } from '../components/Skeleton';
import { toast } from 'react-toastify';
import Badge from '../components/Badge';

const Profile: React.FC = () => {
  const { user, login } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const role = user?.role;

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [pinData, setPinData] = useState({
    currentPin: '',
    newPin: '',
    confirmPin: '',
  });

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  React.useEffect(() => {
    if (user) {
      setIsInitialLoading(false);
    }
  }, [user]);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F0F2F5' }}>
        <div className="w-full px-2 py-3 md:px-4 md:py-4 lg:px-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-3 w-64" />
              </div>
              <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl h-96">
                <Skeleton className="h-28 w-full rounded-t-2xl" />
                <div className="p-6 pt-14 space-y-4">
                  <Skeleton className="h-8 w-1/2" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Skeleton className="h-16 w-full rounded-xl" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 h-[500px]">
              <Skeleton className="h-6 w-32 mb-6" />
              <div className="space-y-6">
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return toast.error('Image size should be less than 2MB');
    }

    const formData = new FormData();
    formData.append('profile_image', file);

    setImageLoading(true);
    try {
      const response = await studentAPI.updateImage(formData);
      if (response.data.success) {
        toast.success('Profile image updated');
        // Update local user context
        const updatedUser = { ...user, profile_image: response.data.data.profile_image };
        login(updatedUser, localStorage.getItem('token') || '');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setImageLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async () => {
    if (!window.confirm('Are you sure you want to remove your profile image?')) return;

    const formData = new FormData();
    formData.append('remove_profile_image', 'true');

    setImageLoading(true);
    try {
      const response = await studentAPI.updateImage(formData);
      if (response.data.success) {
        toast.success('Profile image removed');
        const updatedUser = { ...user, profile_image: null };
        login(updatedUser, localStorage.getItem('token') || '');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove image');
    } finally {
      setImageLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New passwords don't match");
    }
    setLoading(true);
    try {
      await studentAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handlePinChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pinData.newPin !== pinData.confirmPin) {
      return toast.error("New PINs don't match");
    }
    setLoading(true);
    try {
      await studentAPI.changePin({
        currentPin: pinData.currentPin,
        newPin: pinData.newPin,
      });
      toast.success('PIN updated successfully');
      setPinData({ currentPin: '', newPin: '', confirmPin: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update PIN');
    } finally {
      setLoading(false);
    }
  };

  const roleConfig = {
    admin: { label:'Administrator', icon:FaUser, color:'bg-[#002B5B]', id: user?.email },
    teacher: { label:'Teacher', icon:FaChalkboardTeacher, color:'bg-green-600', id: user?.teacher_code },
    student: { label:'Student', icon:FaUserGraduate, color:'bg-blue-600', id: user?.gr_number },
  };
  const cfg = roleConfig[role] || roleConfig.admin;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0F2F5' }}>
      <div className="w-full px-2 py-3 md:px-4 md:py-4 lg:px-6">
        {/* Header Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
              <p className="text-[10px] mt-0.5 font-medium text-gray-500 uppercase tracking-wider">Manage your account and identity</p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50/50 border border-gray-100 rounded-xl shadow-sm self-start sm:self-auto">
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{cfg.label} Mode</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - ID Card & Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="bg-[#002B5B] h-28 relative">
                <div className="absolute -bottom-10 left-6">
                  <div className="relative group">
                    <div className="w-20 h-20 bg-white rounded-2xl border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                      {imageLoading ? (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                          <div className="w-5 h-5 border-2 border-[#002B5B] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : null}
                      {user?.profile_image ? (
                        <img
                          src={user.profile_image}
                          alt="Profile"
                          className="w-full h-full object-cover transition-transform duration-500"
                        />
                      ) : (
                        <cfg.icon className="text-3xl text-gray-200" />
                      )}
                    </div>
                    {/* Image Actions Overlay */}
                    <div className="absolute -right-2 -bottom-2 flex flex-col gap-1.5">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={imageLoading}
                        className="w-7 h-7 bg-blue-600 text-white rounded-lg shadow-sm flex items-center justify-center hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                        title="Change Photo"
                      >
                        <FaCamera className="text-[10px]" />
                      </button>
                      {user?.profile_image && (
                        <button
                          onClick={handleRemoveImage}
                          disabled={imageLoading}
                          className="w-7 h-7 bg-red-500 text-white rounded-lg shadow-sm flex items-center justify-center hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50"
                          title="Remove Photo"
                        >
                          <FaTrashAlt className="text-[10px]" />
                        </button>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
                <div className="absolute top-5 right-6 text-white text-right">
                  <p className="text-[8px] font-bold opacity-60 uppercase tracking-widest">School ERP</p>
                  <p className="text-[13px] font-bold tracking-tight uppercase">Student Digital ID</p>
                </div>
              </div>
              
              <div className="pt-14 px-6 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-50 pb-5 mb-5">
                  <div>
                    <h2 className="text-[18px] font-bold text-gray-900 tracking-tight uppercase">
                      {user?.first_name} {user?.last_name}
                    </h2>
                    <p className="text-[10px] font-bold text-blue-600 mt-0.5 uppercase tracking-widest">{cfg.label}</p>
                  </div>
                  <div className="px-2 py-0.5 bg-green-50 text-green-600 text-[9px] font-bold rounded-lg border border-green-100 uppercase tracking-widest self-start sm:self-auto">
                    Active
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-transparent hover:bg-white hover:shadow-sm transition-all group">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#002B5B]">
                      <FaIdCard className="text-[14px]" />
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Identification</p>
                      <p className="font-bold text-[12px] text-gray-900 uppercase">{cfg.id || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-transparent hover:bg-white hover:shadow-sm transition-all group">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#002B5B]">
                      <FaPhone className="text-[14px]" />
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</p>
                      <p className="font-bold text-[12px] text-gray-900">{user.phone || user.phone1 || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-transparent hover:bg-white hover:shadow-sm transition-all group">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#002B5B]">
                      <FaSchool className="text-[14px]" />
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Class & Medium</p>
                      <p className="font-bold text-[12px] text-gray-900 uppercase">{user.std || '—'} - {user.medium || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-transparent hover:bg-white hover:shadow-sm transition-all group">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#002B5B]">
                      <FaSchool className="text-[14px]" />
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Shift & Stream</p>
                      <p className="font-bold text-[12px] text-gray-900 uppercase">{user.shift || '—'} ({user.stream || '—'})</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-transparent hover:bg-white hover:shadow-sm transition-all group">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#002B5B]">
                      <FaSchool className="text-[14px]" />
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Section Code</p>
                      <p className="font-bold text-[12px] text-gray-900 uppercase">{user.class_code || '—'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Security Settings */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <FaLock className="text-[14px]" />
                </div>
                <h3 className="text-[14px] font-bold text-gray-900 uppercase tracking-tight">Security</h3>
              </div>
              
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1">Current Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-2.5 text-[12px] font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-blue-600 transition-all"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-2.5 text-[12px] font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-blue-600 transition-all"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-2.5 text-[12px] font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-blue-600 transition-all"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#002B5B] text-white py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
                >
                  {loading ? 'Processing...' : 'Update Password'}
                </button>
              </form>

              <div className="my-6 border-t border-gray-50"></div>

              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                  <FaKey className="text-[14px]" />
                </div>
                <h3 className="text-[14px] font-bold text-gray-900 uppercase tracking-tight">Access PIN</h3>
              </div>

              <form onSubmit={handlePinChange} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1">Current 4-Digit PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    placeholder="••••"
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-2.5 text-center text-base tracking-[0.5em] font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-50 focus:border-orange-500 transition-all"
                    value={pinData.currentPin}
                    onChange={(e) => setPinData({...pinData, currentPin: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1">New 4-Digit PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    placeholder="••••"
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-2.5 text-center text-base tracking-[0.5em] font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-50 focus:border-orange-500 transition-all"
                    value={pinData.newPin}
                    onChange={(e) => setPinData({...pinData, newPin: e.target.value})}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-900 text-white py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
                >
                  {loading ? 'Processing...' : 'Update Access PIN'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Profile;
