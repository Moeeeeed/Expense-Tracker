import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Expense } from '../types';
import { formatCurrency } from '../utils/helpers';

interface SummaryChartProps {
  expenses: Expense[];
}

export const SummaryChart = ({ expenses }: SummaryChartProps) => {
  const totalSpent = expenses.reduce((runningTotal, item) => {
    return runningTotal + item.amount;
  }, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Total Spent</Text>
      <Text style={styles.totalValue}>{formatCurrency(totalSpent)}</Text>
      <View style={styles.designBar}>
        <View style={[styles.designBarFill, { width: totalSpent > 0 ? '100%' : '0%' }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  totalValue: {
    fontSize: 42,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },
  designBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    overflow: 'hidden',
  },
  designBarFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 10,
  },
});