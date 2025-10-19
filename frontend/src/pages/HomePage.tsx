import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MapPin, DollarSign, Users, FileText } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      <nav className="flex justify-between items-center px-8 py-4 bg-white/10">
        <h1 className="text-3xl font-bold text-white">Triply</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 text-white hover:bg-white/20 rounded-lg transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Sign Up
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-20">
        <h2 className="text-5xl font-bold text-white mb-4">
          Plan Your Perfect Trip
        </h2>
        <p className="text-xl text-white/80 mb-8 max-w-2xl">
          Unified itineraries, budgets, maps, and documents. Travel organized, efficient, and collaborative.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <div className="bg-white/10 backdrop-blur p-6 rounded-lg text-white">
            <MapPin className="w-8 h-8 mb-4" />
            <h3 className="font-semibold mb-2">Smart Itineraries</h3>
            <p className="text-sm text-white/70">Day-wise schedules and destination planning</p>
          </div>
          <div className="bg-white/10 backdrop-blur p-6 rounded-lg text-white">
            <DollarSign className="w-8 h-8 mb-4" />
            <h3 className="font-semibold mb-2">Budget Tracking</h3>
            <p className="text-sm text-white/70">Track expenses and get smart alerts</p>
          </div>
          <div className="bg-white/10 backdrop-blur p-6 rounded-lg text-white">
            <Users className="w-8 h-8 mb-4" />
            <h3 className="font-semibold mb-2">Collaborate</h3>
            <p className="text-sm text-white/70">Co-edit with friends and family</p>
          </div>
          <div className="bg-white/10 backdrop-blur p-6 rounded-lg text-white">
            <FileText className="w-8 h-8 mb-4" />
            <h3 className="font-semibold mb-2">Documents</h3>
            <p className="text-sm text-white/70">Store and manage travel documents</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/register')}
          className="mt-12 px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
        >
          Get Started Free
        </button>
      </div>
    </div>
  );
};

export default HomePage;