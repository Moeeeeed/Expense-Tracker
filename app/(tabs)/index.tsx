import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { ExpenseCard } from '../../src/components/ExpenseCard';
import { SummaryChart } from '../../src/components/SummaryChart';
import { useExpenseStore } from '../../src/store/useExpenseStore';

export default function DashboardScreen() {
  const router = useRouter();
  const store = useExpenseStore();
  const isDark = store.theme === 'dark';

  // Get 3 most recent expenses
  const recentExpenses = store.expenses.slice(0, 3);

  // 1. Resolve style properties using clean if-else blocks instead of inline ternaries
  let containerBgStyle = styles.bgLight;
  let textPrimaryStyle = styles.textDark;
  let textSecondaryStyle = styles.textMutedLight;
  let toggleBtnStyle = styles.toggleLight;
  let emptyCardStyle = styles.cardLight;
  let themeIconColor = '#171717'; // Light mode icon

  if (isDark === true) {
    containerBgStyle = styles.bgDark;
    textPrimaryStyle = styles.textWhite;
    textSecondaryStyle = styles.textMutedDark;
    toggleBtnStyle = styles.toggleDark;
    emptyCardStyle = styles.cardDark;
    themeIconColor = '#fbbf24'; // Moon/sun orange-yellow
  }

  // 2. Simple navigation handlers
  const handleToggleTheme = () => {
    store.toggleTheme();
  };

  const handleViewAllPress = () => {
    router.push('/list');
  };

  const handleAddExpensePress = () => {
    router.push('/two');
  };

  // Determine icon name
  let themeIconName: any = 'moon-o';
  if (isDark === true) {
    themeIconName = 'sun-o';
  }

  return (
    <ScrollView
      style={[styles.container, containerBgStyle]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Header Row */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.headerSubtitle, textSecondaryStyle]}>
            Welcome Back
          </Text>
          <Text style={[styles.headerTitle, textPrimaryStyle]}>
            Expense Tracker
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.themeToggle, toggleBtnStyle]}
          onPress={handleToggleTheme}
        >
          <FontAwesome name={themeIconName} size={18} color={themeIconColor} />
        </TouchableOpacity>
      </View>

      {/* Spending Visual Charts */}
      <SummaryChart expenses={store.expenses} />

      {/* Recent Transactions Header */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, textPrimaryStyle]}>
          Recent Expenses
        </Text>
        {store.expenses.length > 0 ? (
          <TouchableOpacity onPress={handleViewAllPress}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Recent Expenses List or Empty Card */}
      {recentExpenses.length === 0 ? (
        <View style={[styles.emptyCardBase, emptyCardStyle]}>
          <FontAwesome
            name="folder-open-o"
            size={36}
            color={isDark ? '#404040' : '#d4d4d4'}
            style={styles.emptyIcon}
          />
          <Text style={[styles.emptyText, textSecondaryStyle]}>
            No expenses recorded yet.
          </Text>
          <TouchableOpacity style={styles.addExpenseBtn} onPress={handleAddExpensePress}>
            <Text style={styles.addExpenseBtnText}>Add Expense Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          {recentExpenses.map((item) => (
            <ExpenseCard key={item.id} item={item} onDelete={store.deleteExpense} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgLight: {
    backgroundColor: '#ffffff', // Plain white background
  },
  bgDark: {
    backgroundColor: '#000000', // Pure black background
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 6,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 2,
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  toggleLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e5e5',
  },
  toggleDark: {
    backgroundColor: '#121212',
    borderColor: '#262626',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10b981', // Emerald green
  },
  emptyCardBase: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  cardLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e5e5',
  },
  cardDark: {
    backgroundColor: '#121212',
    borderColor: '#262626',
  },
  emptyIcon: {
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 12,
  },
  addExpenseBtn: {
    backgroundColor: '#10b981', // Emerald green
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  addExpenseBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  textWhite: { color: '#ffffff' },
  textDark: { color: '#171717' },
  textMutedLight: { color: '#737373' },
  textMutedDark: { color: '#a3a3a3' },
});