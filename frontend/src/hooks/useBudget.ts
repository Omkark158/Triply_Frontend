import { useState, useEffect } from 'react';
import { Expense, BudgetSummary, ExpenseFormData } from '../types/budget';
import { budgetService } from '../services/budget';
import toast from 'react-hot-toast';

export const useBudget = (tripId?: number) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async (tripIdParam?: number) => {
    try {
      setLoading(true);
      const response = await budgetService.getAllExpenses(tripIdParam || tripId);
      setExpenses(response.results);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgetSummary = async (tripIdParam: number) => {
    try {
      const summaryData = await budgetService.getBudgetSummary(tripIdParam);
      setSummary(summaryData);
    } catch (err: any) {
      toast.error('Failed to fetch budget summary');
    }
  };

  const createExpense = async (data: ExpenseFormData) => {
    try {
      const newExpense = await budgetService.createExpense(data);
      setExpenses([newExpense, ...expenses]);
      
      // Refresh summary if tripId matches
      if (tripId && data.trip === tripId) {
        await fetchBudgetSummary(tripId);
      }
      
      toast.success('Expense added successfully!');
      return newExpense;
    } catch (err: any) {
      toast.error('Failed to add expense');
      throw err;
    }
  };

  const updateExpense = async (id: number, data: ExpenseFormData) => {
    try {
      const updatedExpense = await budgetService.updateExpense(id, data);
      setExpenses(expenses.map(exp => exp.id === id ? updatedExpense : exp));
      
      // Refresh summary
      if (tripId) {
        await fetchBudgetSummary(tripId);
      }
      
      toast.success('Expense updated successfully!');
      return updatedExpense;
    } catch (err: any) {
      toast.error('Failed to update expense');
      throw err;
    }
  };

  const deleteExpense = async (id: number) => {
    try {
      await budgetService.deleteExpense(id);
      setExpenses(expenses.filter(exp => exp.id !== id));
      
      // Refresh summary
      if (tripId) {
        await fetchBudgetSummary(tripId);
      }
      
      toast.success('Expense deleted successfully!');
    } catch (err: any) {
      toast.error('Failed to delete expense');
      throw err;
    }
  };

  const getTotalByCategory = (category: string): number => {
    return expenses
      .filter(exp => exp.category === category)
      .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  };

  const getExpensesByDateRange = (startDate: string, endDate: string): Expense[] => {
    return expenses.filter(exp => {
      const expenseDate = new Date(exp.date);
      return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
    });
  };

  useEffect(() => {
    if (tripId) {
      fetchExpenses(tripId);
      fetchBudgetSummary(tripId);
    }
  }, [tripId]);

  return {
    expenses,
    summary,
    loading,
    error,
    fetchExpenses,
    fetchBudgetSummary,
    createExpense,
    updateExpense,
    deleteExpense,
    getTotalByCategory,
    getExpensesByDateRange,
  };
};