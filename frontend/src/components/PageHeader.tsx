import React from 'react';
import { useAuth } from '../context/AuthContext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showWelcome?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, showWelcome = false }) => {
  const { user } = useAuth();

  return (
    <>
      

      {/* Mobile Page Banner */}
      <div className="md:hidden bg-[#002B5B] pt-8 pb-10 px-5 relative">
        <div className="text-white">
          <h1 className="text-xl font-bold">
            {showWelcome ? `Welcome, ${user?.first_name || 'Student'}` : title}
          </h1>
          {subtitle && (
            <p className="text-[11px] mt-1 opacity-80 font-medium">{subtitle}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default PageHeader;
