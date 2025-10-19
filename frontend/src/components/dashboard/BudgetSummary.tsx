import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { Trip } from '../../context/TripContext';
import { useTrip } from '../../context/TripContext';

interface BudgetSummaryProps {
  trips: Trip[]; // Ensure trips is passed if not using useTrip directly
}

export const BudgetSummary: React.FC<BudgetSummaryProps> = ({ trips }) => {
  const navigate = useNavigate();
  const { currentTrip } = useTrip();

  // Calculate total budget from trips
  const totalBudget = trips.reduce((sum, trip) => sum + (trip.budget || 0), 0);

  // Note: Actual spent amount would come from Budget API
  // For now showing just budget info
  const totalSpent = 0;
  const remaining = totalBudget - totalSpent;
  const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  if (trips.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Budget Overview</h2>
        <div className="text-center py-8 text-gray-500">
          <AlertCircle className="mx-auto mb-2" size={32} />
          <p>No budget data available</p>
        </div>
      </div>
    );
  }

  const handleCardClick = useCallback(() => {
    const tripId = currentTrip?.id || trips[0]?.id;
    console.log('Attempting navigation, tripId:', tripId); // Debug log
    if (tripId) {
      navigate(`/trips/${tripId}/budget`);
    } else {
      console.error('No trip selected for budget overview');
    }
  }, [navigate, currentTrip?.id, trips]);

  // Prevent navigation when clicking interactive elements
  const handleInteractiveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="bg-orange-100 rounded-lg shadow cursor-pointer hover:bg-orange-200 transition-all"
      onClick={handleCardClick}
    >
      <div className="p-6 border-b border-orange-200">
        <h2 className="text-xl font-bold text-gray-900">Budget Overview</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Total Budget */}
        <div onClick={handleInteractiveClick}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Budget</span>
            <span className="text-lg font-bold text-gray-900">
              ${totalBudget.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Spent</span>
            <span className="text-lg font-bold text-orange-600">
              ${totalSpent.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Remaining</span>
            <span className={`text-lg font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(remaining).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div onClick={handleInteractiveClick}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Budget Used</span>
            <span className="text-sm font-semibold text-gray-900">
              {percentageUsed.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                percentageUsed > 90
                  ? 'bg-red-600'
                  : percentageUsed > 70
                  ? 'bg-orange-500'
                  : 'bg-green-600'
              }`}
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            />
          </div>
        </div>

        {/* Budget Status */}
        <div onClick={handleInteractiveClick} className="pt-4 border-t border-orange-200">
          {remaining >= 0 ? (
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp size={20} />
              <span className="text-sm font-medium">On track with budget</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-600">
              <TrendingDown size={20} />
              <span className="text-sm font-medium">Over budget</span>
            </div>
          )}
        </div>

        {/* Trip Count */}
        <div onClick={handleInteractiveClick} className="pt-4 border-t border-orange-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Active Trips</span>
            <span className="text-2xl font-bold text-blue-600">{trips.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummary;