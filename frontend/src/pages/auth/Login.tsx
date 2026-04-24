import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { FaUserGraduate, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<'password' | 'pin'>('password');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({
    gr_number: '',
    password: '',
    pin: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loginData: any = { gr_number: formData.gr_number };
      if (formData.password) loginData.password = formData.password;
      if (formData.pin) loginData.pin = formData.pin;

      console.log('Attempting login with:', loginData);
      const response = await studentAPI.login(loginData);
      console.log('Login response:', response.data);
      
      const { data, token } = response.data;
      const userData = { ...data, role: 'student' };
      
      // First show success toast
      toast.success('Login successful!');
      
      // Small delay to ensure toast is visible before potential navigation
      setTimeout(() => {
        login(userData, token);
        navigate('/student/dashboard');
      }, 1000);
    } catch (error: any) {
      console.error('Login error detail:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Login failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative">
      <div className="max-w-sm w-full relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-[#002B5B] mb-2">
              School ERP
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              type="button"
              onClick={() => setLoginMethod('password')}
              className={`flex flex-col items-center p-2 rounded-lg border transition-all ${
                loginMethod === 'password'
                  ? 'border-[#002B5B] bg-[#E8F0F8] text-[#002B5B]'
                  : 'border-gray-200 hover:border-[#002B5B] text-gray-600'
              }`}
            >
              <FaUserGraduate className="text-xl mb-1" />
              <span className="text-xs font-medium">Password</span>
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('pin')}
              className={`flex flex-col items-center p-2 rounded-lg border transition-all ${
                loginMethod === 'pin'
                  ? 'border-[#002B5B] bg-[#E8F0F8] text-[#002B5B]'
                  : 'border-gray-200 hover:border-[#002B5B] text-gray-600'
              }`}
            >
              <FaKey className="text-xl mb-1" />
              <span className="text-xs font-medium">PIN</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GR Number
              </label>
              <input
                type="text"
                name="gr_number"
                value={formData.gr_number}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none transition-all"
                placeholder="Enter your GR number"
                required
              />
            </div>

            {loginMethod === 'password' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none transition-all pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#002B5B] transition-colors"
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  4-Digit PIN
                </label>
                <input
                  type="password"
                  name="pin"
                  value={formData.pin}
                  onChange={handleChange}
                  maxLength={4}
                  className="w-full px-3 py-2 text-center text-2xl tracking-widest border border-gray-300 rounded-lg outline-none transition-all"
                  placeholder="••••"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Enter your 4-digit PIN</p>
              </div>
            )}

           

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#002B5B] mt-5 hover:bg-[#004A8F] text-white font-medium py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          
        </div>
      </div>
    </div>
  );
};

export default Login;