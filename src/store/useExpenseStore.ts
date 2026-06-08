import { create } from 'zustand';
import { Expense } from '../types';

interface ExpenseStoreState {
  expenses: Expense[];
  addExpense: (title: string, amount: number, category: string) => void;
  deleteExpense: (id: string) => void;
  editExpense: (id: string, title: string, amount: number, category: string) => void;
}

export const useExpenseStore = create<ExpenseStoreState>((set) => ({
  expenses: [],
  
  addExpense: (title, amount, category) => set((state) => ({
    expenses: [
      {
        id: Math.random().toString(36).substring(2, 9),
        title,
        amount,
        category: category as Expense['category'],
        date: new Date().toISOString(),
      },
      ...state.expenses,
    ],
  })),

  deleteExpense: (id) => set((state) => ({
    expenses: state.expenses.filter((item) => item.id !== id),
  })),

  editExpense: (id, title, amount, category) => set((state) => ({
    expenses: state.expenses.map((item) =>
      item.id === id
        ? { ...item, title, amount, category: category as Expense['category'] }
        : item
    ),
  })),
}));