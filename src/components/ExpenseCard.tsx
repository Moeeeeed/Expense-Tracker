import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Expense } from '../types';
import { formatCurrency, formatDate } from '../utils/helpers';

interface ExpenseCardProps {
  item: Expense;
  onDelete: (id: string) => void;
}

export const ExpenseCard = ({ item, onDelete }: ExpenseCardProps) => {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <View style={styles.leftContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>
          {item.category} • {formatDate(item.date)}
        </Text>
      </View>

      <View style={styles.rightContent}>
        <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/two', params: { id: item.id } })}
            style={styles.editButton}
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDelete(item.id)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  leftContent: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 4 },
  meta: { fontSize: 13, color: '#6b7280' },
  rightContent: { alignItems: 'flex-end' },
  amount: { fontSize: 16, fontWeight: '700', color: '#111827' },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  editButton: { paddingVertical: 4, paddingHorizontal: 8, backgroundColor: '#e0f2fe', borderRadius: 6 },
  editText: { fontSize: 12, fontWeight: '600', color: '#0284c7' },
  deleteButton: { paddingVertical: 4, paddingHorizontal: 8, backgroundColor: '#fee2e2', borderRadius: 6 },
  deleteText: { fontSize: 12, fontWeight: '600', color: '#dc2626' },
});