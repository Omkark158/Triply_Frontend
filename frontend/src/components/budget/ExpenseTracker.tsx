import React, { useState } from 'react';
import { Expense } from '../../context/TripContext';
import { useTrip } from '../../context/TripContext';
import { Receipt, Trash2, Calendar, Tag } from 'lucide-react';

interface ExpenseTrackerProps {
  expenses: Expense[];
  currency: 'USD' | 'INR';
  onExpenseUpdated: () => void;
}

export const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({
  expenses,
  currency,
  onExpenseUpdated,
}) => {
  const { deleteExpense } = useTrip();
  const [deleting, setDeleting] = useState<string | null>(null);
  const currencySymbol = currency === 'USD' ? '$' : '₹';

  const handleDelete = async (expenseId: string, title: string) => {
    if (!confirm(`Delete expense "${title}"?`)) return;

    try {
      setDeleting(expenseId);
      await deleteExpense(expenseId);
      onExpenseUpdated();
    } catch (error) {
      console.error('Error deleting expense:', error);
    } finally {
      setDeleting(null);
    }
  };

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Receipt size={24} />
        Recent Expenses
      </h2>

      {expenses.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No expenses recorded</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sortedExpenses.map(expense => (
            <div
              key={expense.id}
              className="flex items-start justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{expense.title}</h3>
                <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(expense.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag size={12} />
                    <span className="capitalize">{expense.category.replace('_', ' ')}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded ${
                    expense.expense_type === 'group'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {expense.expense_type}
                  </span>
                </div>
                {expense.description && (
                  <p className="text-sm text-gray-600 mt-1">{expense.description}</p>
                )}
              </div>
              <div className="flex items-center gap-3 ml-4">
                <p className="font-bold text-gray-900 whitespace-nowrap">
                  {currencySymbol}
                  {expense.amount.toFixed(2)}
                </p>
                <button
                  onClick={() => handleDelete(expense.id, expense.title)}
                  disabled={deleting === expense.id}
                  className="p-1 hover:bg-red-100 rounded transition text-red-600 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseTracker;