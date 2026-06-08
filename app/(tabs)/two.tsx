import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FormInput } from '../../src/components/FormInput';
import { useExpenseStore } from '../../src/store/useExpenseStore';

const CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Other'];

export default function AddExpenseScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>(); 
  const { expenses, addExpense, editExpense } = useExpenseStore();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');

  useEffect(() => {
    if (id) {
      const existingExpense = expenses.find((e) => e.id === id);
      if (existingExpense) {
        setTitle(existingExpense.title);
        setAmount(existingExpense.amount.toString());
        setCategory(existingExpense.category);
      }
    }
  }, [id, expenses]);

  const handleSave = () => {
    if (!title || !amount) {
      Alert.alert('Missing Info', 'Please enter both a title and an amount.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid number.');
      return;
    }

    if (id) {
      editExpense(id, title, parsedAmount, category);
    } else {
      addExpense(title, parsedAmount, category);
    }

    setTitle('');
    setAmount('');
    setCategory('Food');
    router.push('/');
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.header}>{id ? 'Edit Expense' : 'Add New Expense'}</Text>

      <FormInput
        label="Expense Title"
        placeholder="e.g., Dinner with friends"
        value={title}
        onChangeText={setTitle}
      />

      <FormInput
        label="Amount ($)"
        placeholder="e.g., 2200"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryContainer}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryChip, category === cat && styles.activeChip]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.categoryText, category === cat && styles.activeText]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{id ? 'Update Expense' : 'Save Expense'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 20, color: '#1a1a1a' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 10, marginTop: 10, color: '#333' },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 30 },
  categoryChip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#e9ecef', borderWidth: 1, borderColor: '#dee2e6' },
  activeChip: { backgroundColor: '#007aff', borderColor: '#007aff' },
  categoryText: { color: '#495057', fontWeight: '500' },
  activeText: { color: '#fff' },
  saveButton: { backgroundColor: '#007aff', paddingVertical: 16, borderRadius: 12, alignItems: 'center', shadowColor: '#007aff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});