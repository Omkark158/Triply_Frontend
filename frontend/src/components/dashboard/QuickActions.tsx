import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MapPin, DollarSign, FileText } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Plus,
      label: 'Create Trip',
      description: 'Start planning a new adventure',
      action: () => navigate('/trips/create'),
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      icon: MapPin,
      label: 'View Dashboard',
      description: 'See all your trips',
      action: () => {
        // Scroll to top of dashboard
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      icon: DollarSign,
      label: 'Budget Overview',
      description: 'Monitor your expenses',
      action: () => {
        // Scroll to budget section
        const budgetSection = document.querySelector('[class*="Budget"]');
        budgetSection?.scrollIntoView({ behavior: 'smooth' });
      },
      color: 'bg-orange-600 hover:bg-orange-700',
    },
    {
      icon: FileText,
      label: 'Profile',
      description: 'Manage your profile',
      action: () => navigate('/profile'),
      color: 'bg-purple-600 hover:bg-purple-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, idx) => {
        const Icon = action.icon;
        return (
          <button
            key={idx}
            onClick={action.action}
            className={`${action.color} text-white rounded-lg shadow-lg p-6 transition transform hover:scale-105 text-left`}
          >
            <Icon size={28} className="mb-3" />
            <h3 className="font-bold text-lg mb-1">{action.label}</h3>
            <p className="text-sm opacity-90">{action.description}</p>
          </button>
        );
      })}
    </div>
  );
};

export default QuickActions;