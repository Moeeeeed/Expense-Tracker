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
  theme: 'light' | 'dark';
  unreadCount: number;
  isSplashActive: boolean;
  setSplashActive: (active: boolean) => void;
  toggleTheme: () => void;
  clearUnreadCount: () => void;
  loadExpenses: () => Promise<void>;
  addExpense: (title: string, amount: number, category: string, date: string, notes?: string) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  editExpense: (id: string, title: string, amount: number, category: string, date: string, notes?: string) => Promise<void>;
}