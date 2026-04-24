import React, { createContext, useState, useContext, useEffect } from 'react';
import { classAPI } from '../services/api'; // Adjust path as needed

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setToken(storedToken);
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  const login = async (userData: any, userToken: any) => {
    let enhancedUserData = { ...userData };
    
    // Fetch class details if user has class_code or class_id
    if (userData.class_code) {
      try {
        const classResponse = await classAPI.getByCode(userData.class_code);
        if (classResponse.data.data) {
          enhancedUserData = {
            ...enhancedUserData,
            class_name: classResponse.data.data.class_name,
            class_section: classResponse.data.data.section,
            class_full_name: `${classResponse.data.data.class_name} ${classResponse.data.data.section || ''}`.trim()
          };
        }
      } catch (error) {
        console.error('Error fetching class details:', error);
        // Fallback: use class_code as is
        enhancedUserData.class_name = userData.class_code;
      }
    } else if (userData.class_id) {
      try {
        const classResponse = await classAPI.getById(userData.class_id);
        if (classResponse.data.data) {
          enhancedUserData = {
            ...enhancedUserData,
            class_code: classResponse.data.data.class_code,
            class_name: classResponse.data.data.class_name,
            class_section: classResponse.data.data.section,
            class_full_name: `${classResponse.data.data.class_name} ${classResponse.data.data.section || ''}`.trim()
          };
        }
      } catch (error) {
        console.error('Error fetching class details:', error);
      }
    }
    
    setUser(enhancedUserData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(enhancedUserData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};