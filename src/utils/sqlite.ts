import { Expense } from '../types';

class SQLiteDatabase {
  private expenses: Expense[] = [];

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('expenses_sqlite_db');
      if (stored) {
        try {
          this.expenses = JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse SQLite storage:', e);
        }
      } else {
        // Seed initial mock expenses for presentation
        this.expenses = [
          {
            id: 'demo-1',
            title: 'Dinner with friends',
            amount: 2200,
            category: 'Food',
            date: '2026-06-01',
            notes: 'Italian restaurant downtown',
          },
          {
            id: 'demo-2',
            title: 'Monthly Electricity Bill',
            amount: 4500,
            category: 'Utilities',
            date: '2026-06-03',
            notes: 'High due to summer AC use',
          },
          {
            id: 'demo-3',
            title: 'Uber rides',
            amount: 850,
            category: 'Transport',
            date: '2026-06-04',
            notes: 'Commute to office',
          },
          {
            id: 'demo-4',
            title: 'Netflix Subscription',
            amount: 1500,
            category: 'Entertainment',
            date: '2026-06-05',
          },
        ];
        this.save();
      }
    }
  }

  private save() {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('expenses_sqlite_db', JSON.stringify(this.expenses));
    }
  }

  /**
   * Simulates executing a SQL query.
   * Returns a promise containing { rows: { _array: Expense[] }, rowsAffected: number, insertId?: string }
   */
  public async executeSql(query: string, params: any[] = []): Promise<any> {
    console.log(`[SQLite Connection] Executing query: "${query}" with params:`, params);

    // Simulate disk operation delay
    await new Promise((resolve) => setTimeout(resolve, 50));

    const sanitizedQuery = query.trim().replace(/\s+/g, ' ').toUpperCase();

    // 1. CREATE TABLE
    if (sanitizedQuery.includes('CREATE TABLE')) {
      return { rows: { _array: [], length: 0 }, rowsAffected: 0 };
    }

    // 2. SELECT
    if (sanitizedQuery.startsWith('SELECT')) {
      const sorted = [...this.expenses].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      return {
        rows: {
          _array: sorted,
          length: sorted.length,
          item: (index: number) => sorted[index],
        },
        rowsAffected: 0,
      };
    }

    // 3. INSERT
    if (sanitizedQuery.startsWith('INSERT INTO')) {
      // Expecting parameters: [id, title, amount, category, date, notes]
      const [id, title, amount, category, date, notes] = params;
      const newExpense: Expense = {
        id: id || Math.random().toString(36).substring(2, 9),
        title,
        amount: parseFloat(amount),
        category,
        date,
        notes: notes || '',
      };
      this.expenses.push(newExpense);
      this.save();
      return {
        rowsAffected: 1,
        insertId: newExpense.id,
        rows: { _array: [], length: 0 },
      };
    }

    // 4. UPDATE
    if (sanitizedQuery.startsWith('UPDATE')) {
      // Expecting parameters: [title, amount, category, date, notes, id]
      const [title, amount, category, date, notes, id] = params;
      const targetId = Array.isArray(id) ? id[0] : id;
      let found = false;
      this.expenses = this.expenses.map((item) => {
        if (item.id === targetId) {
          found = true;
          return {
            ...item,
            title,
            amount: parseFloat(amount),
            category: category as any,
            date,
            notes: notes || '',
          };
        }
        return item;
      });
      console.log(`[SQLite Connection] UPDATE status: targetId=${targetId}, found=${found}`);
      if (found) {
        this.save();
        return { rowsAffected: 1, rows: { _array: [], length: 0 } };
      }
      return { rowsAffected: 0, rows: { _array: [], length: 0 } };
    }

    // 5. DELETE
    if (sanitizedQuery.startsWith('DELETE FROM')) {
      const [id] = params;
      const initialLength = this.expenses.length;
      this.expenses = this.expenses.filter((item) => item.id !== id);
      if (this.expenses.length < initialLength) {
        this.save();
        return { rowsAffected: 1, rows: { _array: [], length: 0 } };
      }
      return { rowsAffected: 0, rows: { _array: [], length: 0 } };
    }

    throw new Error(`Unsupported SQL query in simulation: ${query}`);
  }
}

export const sqliteDb = new SQLiteDatabase();
