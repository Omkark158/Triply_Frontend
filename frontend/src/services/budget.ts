import api from './api';
import { Expense, BudgetSummary, ExpenseFormData } from '../types/budget';
import { ApiResponse } from '../types/common';

export const budgetService = {
  getAllExpenses: async (tripId?: number): Promise<ApiResponse<Expense>> => {
    const url = tripId ? `/budgets/?trip=${tripId}` : '/budgets/';
    const response = await api.get<ApiResponse<Expense>>(url);
    return response.data;
  },

  getExpenseById: async (id: number): Promise<Expense> => {
    const response = await api.get<Expense>(`/budgets/${id}/`);
    return response.data;
  },

  createExpense: async (data: ExpenseFormData): Promise<Expense> => {
    const response = await api.post<Expense>('/budgets/', data);
    return response.data;
  },

  updateExpense: async (id: number, data: ExpenseFormData): Promise<Expense> => {
    const response = await api.put<Expense>(`/budgets/${id}/`, data);
    return response.data;
  },

  deleteExpense: async (id: number): Promise<void> => {
    await api.delete(`/budgets/${id}/`);
  },

  getBudgetSummary: async (tripId: number): Promise<BudgetSummary> => {
    const response = await api.get<BudgetSummary>(`/budgets/summary/${tripId}/`);
    return response.data;
  },
};