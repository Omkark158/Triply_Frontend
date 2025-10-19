import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm flex items-center gap-1">
            Made with <Heart size={16} className="text-red-500 fill-red-500" /> by Triply Team
          </p>
          <p className="text-gray-500 text-sm">© 2024 Triply. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;