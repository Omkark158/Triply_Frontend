import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* The pt-16 class here provides the required "distance from top" 
        for the Login and Register pages.
      */}
      <div className="pt-16 min-h-[calc(100vh-64px)] flex items-center justify-center p-4 w-full">
        {/* Removed the incomplete 'mt-' class here for cleaner styling. */}
        <div className="w-full max-w-md mx-auto">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;