import React, { useEffect, useState } from 'react';
import { useTrip, Budget, Expense } from '../../context/TripContext';
import { useNotification } from '../../context/NotificationContext';
import ExpenseTracker from './ExpenseTracker';
import BudgetAlerts from './BudgetAlerts';
import ExpenseChart from './ExpenseChart';
import AddExpense from './AddExpense';
import { DollarSign, TrendingUp, TrendingDown, Plus, Loader } from 'lucide-react';

interface BudgetDashboardProps {
  tripId?: string;
}

export const BudgetDashboard: React.FC<BudgetDashboardProps> = ({ tripId }) => {
  const { currentTrip, getBudget, getExpenses } = useTrip();
  const { addNotification } = useNotification();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const actualTripId = tripId || currentTrip?.id;

  useEffect(() => {
    if (actualTripId) {
      loadData();
    }
  }, [actualTripId]);

  const loadData = async () => {
    if (!actualTripId) return;
    try {
      setLoading(true);
      const [budgetData, expensesData] = await Promise.all([
        getBudget(actualTripId),
        getExpenses(actualTripId),
      ]);
      console.log('Budget data loaded:', budgetData); // Debug log
      console.log('Expenses data loaded:', expensesData); // Debug log
      setBudget(budgetData);
      setExpenses(expensesData);
    } catch (error) {
      console.error('Error loading budget data:', error);
      addNotification({ type: 'error', message: 'Failed to load budget data' });
      setBudget(null);
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseAdded = () => {
    setShowAddExpense(false);
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading budget data...</p>
        </div>
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-800">Budget data not available for this trip.</p>
      </div>
    );
  }

  // Convert string values to numbers with fallback to 0
  const totalBudget = Number(budget.total_budget) || 0;
  const totalSpent = Number(budget.total_spent) || 0;
  const remaining = Number(budget.remaining) || 0;
  const currency = budget.currency || 'USD';
  const currencySymbol = currency === 'USD' ? '$' : '₹';
  const percentSpent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <DollarSign size={28} />
                Budget Overview
              </h1>
              <p className="text-green-100 text-sm mt-1">Track and manage your expenses</p>
            </div>
            <button
              onClick={() => setShowAddExpense(!showAddExpense)}
              className="px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition font-semibold flex items-center gap-2"
            >
              <Plus size={20} />
              {showAddExpense ? 'Cancel' : 'Add Expense'}
            </button>
          </div>
        </div>

        {/* Add Expense Form */}
        {showAddExpense && actualTripId && (
          <div className="p-6 border-b bg-green-50">
            <AddExpense tripId={actualTripId} onExpenseAdded={handleExpenseAdded} />
          </div>
        )}

        {/* Budget Stats */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Total Budget</p>
            <p className="text-2xl font-bold text-gray-900">
              {currencySymbol}
              {totalBudget.toLocaleString()}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              <TrendingDown size={16} />
              Spent
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {currencySymbol}
              {totalSpent.toLocaleString()}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              <TrendingUp size={16} />
              Remaining
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {currencySymbol}
              {remaining.toLocaleString()}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <p className="text-sm text-gray-600 mb-1">Progress</p>
            <p className="text-2xl font-bold text-gray-900">{percentSpent.toFixed(1)}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full ${
                  percentSpent > 90 ? 'bg-red-600' : percentSpent > 75 ? 'bg-orange-600' : 'bg-green-600'
                }`}
                style={{ width: `${Math.min(percentSpent, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Alerts */}
      <BudgetAlerts budget={budget} />

      {/* Charts and Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseChart expenses={expenses} currency={currency} />
        <ExpenseTracker expenses={expenses} currency={currency} onExpenseUpdated={loadData} />
      </div>
    </div>
  );
};

export default BudgetDashboard;