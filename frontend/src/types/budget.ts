export interface Expense {
  id: number;
  trip: number;
  title: string;
  description?: string;
  amount: string;
  category: 'accommodation' | 'food' | 'transport' | 'activities' | 'shopping' | 'entertainment' | 'emergency' | 'other';
  date: string;
  receipt_image?: string;
  created_at: string;
  updated_at: string;
}

export interface BudgetSummary {
  total_budget: string;
  total_spent: string;
  remaining: string;
  percentage_used: number;
  expenses_by_category: {
    [key: string]: number;
  };
}

export interface ExpenseFormData {
  trip: number;
  title: string;
  description?: string;
  amount: string;
  category: string;
  date: string;
}