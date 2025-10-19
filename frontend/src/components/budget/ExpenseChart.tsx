import React from 'react';
import { Expense } from '../../context/TripContext';
import { PieChart } from 'lucide-react';

interface ExpenseChartProps {
  expenses: Expense[];
  currency: 'USD' | 'INR';
}

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenses, currency }) => {
  const currencySymbol = currency === 'USD' ? '$' : '₹';

  // Group expenses by category
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const categories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([category, amount]) => ({
      category,
      amount,
    }));

  const total = categories.reduce((sum, cat) => sum + cat.amount, 0);

  const CATEGORY_COLORS: Record<string, string> = {
    accommodation: 'bg-blue-500',
    food: 'bg-orange-500',
    transport: 'bg-purple-500',
    activities: 'bg-green-500',
    shopping: 'bg-pink-500',
    entertainment: 'bg-yellow-500',
    emergency: 'bg-red-500',
    other: 'bg-gray-500',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <PieChart size={24} />
        Expenses by Category
      </h2>

      {categories.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No expenses yet</p>
      ) : (
        <div className="space-y-3">
          {categories.map(({ category, amount }) => {
            const percentage = (amount / total) * 100;
            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-900 capitalize">
                    {category.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-gray-600">
                    {currencySymbol}
                    {amount.toFixed(2)} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${CATEGORY_COLORS[category] || 'bg-gray-500'}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExpenseChart;