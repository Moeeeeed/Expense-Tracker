export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: 'Food' | 'Transport' | 'Utilities' | 'Entertainment' | 'Other';
  notes?: string;
}

export interface ExpenseStore {
  expenses: Expense[];
  addExpense: (title: string, amount: number, category: string) => void;
  deleteExpense: (id: string) => void;
  editExpense: (id: string, title: string, amount: number, category: string) => void;
}