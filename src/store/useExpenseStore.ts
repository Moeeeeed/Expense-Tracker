import { create } from 'zustand';
import { Expense, ExpenseStore } from '../types';
import { sqliteDb } from '../utils/sqlite';

// Helper to check initial theme from localStorage
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = window.localStorage.getItem('expense_app_theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  }
  return 'light'; // Default to light mode
};

export const useExpenseStore = create<ExpenseStore>((set, get) => {
  // Initialize table
  sqliteDb.executeSql(
    'CREATE TABLE IF NOT EXISTS expenses (id TEXT PRIMARY KEY, title TEXT, amount REAL, category TEXT, date TEXT, notes TEXT)'
  ).then(() => {
    // Load expenses right after table check
    get().loadExpenses();
  });

  return {
    expenses: [],
    theme: getInitialTheme(),
    unreadCount: 0,
    isSplashActive: true,

    setSplashActive: (active) => set({ isSplashActive: active }),

    toggleTheme: () => {
      const nextTheme = get().theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('expense_app_theme', nextTheme);
      }
      set({ theme: nextTheme });
    },

    clearUnreadCount: () => set({ unreadCount: 0 }),

    loadExpenses: async () => {
      try {
        const result = await sqliteDb.executeSql('SELECT * FROM expenses');
        const rows = result.rows._array as Expense[];
        set({ expenses: rows });
      } catch (err) {
        console.error('Failed to load expenses from sqlite:', err);
      }
    },

    addExpense: async (title, amount, category, date, notes = '') => {
      const id = Math.random().toString(36).substring(2, 9);
      try {
        await sqliteDb.executeSql(
          'INSERT INTO expenses (id, title, amount, category, date, notes) VALUES (?, ?, ?, ?, ?, ?)',
          [id, title, amount, category, date, notes]
        );
        // Increment unread badge count for list tab
        set((state) => ({ unreadCount: state.unreadCount + 1 }));
        await get().loadExpenses();
      } catch (err) {
        console.error('Failed to add expense to sqlite:', err);
      }
    },

    deleteExpense: async (id) => {
      const targetId = Array.isArray(id) ? id[0] : id;
      try {
        await sqliteDb.executeSql('DELETE FROM expenses WHERE id = ?', [targetId]);
        await get().loadExpenses();
      } catch (err) {
        console.error('Failed to delete expense from sqlite:', err);
      }
    },

    editExpense: async (id, title, amount, category, date, notes = '') => {
      const targetId = Array.isArray(id) ? id[0] : id;
      try {
        await sqliteDb.executeSql(
          'UPDATE expenses SET title = ?, amount = ?, category = ?, date = ?, notes = ? WHERE id = ?',
          [title, amount, category, date, notes, targetId]
        );
        await get().loadExpenses();
      } catch (err) {
        console.error('Failed to edit expense in sqlite:', err);
      }
    },
  };
});