import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FormInput } from '../../src/components/FormInput';
import { useExpenseStore } from '../../src/store/useExpenseStore';

const CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Other'];
const CATEGORY_COLORS: Record<string, string> = {
  Food: '#10b981', // Emerald
  Transport: '#3b82f6', // Blue
  Utilities: '#06b6d4', // Cyan
  Entertainment: '#8b5cf6', // Purple
  Other: '#737373', // Gray
};

const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Date validation checker (uses simple checks for beginners)
const validateDateString = (dateStr: string): string | null => {
  const trimmed = dateStr.trim();
  if (trimmed === '') {
    return 'Date is required.';
  }
  
  const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
  const match = trimmed.match(dateRegex);
  if (match === null) {
    return 'Format must be YYYY-MM-DD (e.g., 2026-06-09).';
  }
  
  const yearStr = match[1];
  const monthStr = match[2];
  const dayStr = match[3];
  
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  if (month < 1 || month > 12) {
    return 'Month must be between 01 and 12.';
  }
  if (day < 1 || day > 31) {
    return 'Day must be between 01 and 31.';
  }
  
  // Calculate max days in the specific month
  const maxDays = new Date(year, month, 0).getDate();
  if (day > maxDays) {
    return 'Invalid date for this month (e.g. Feb 30 does not exist).';
  }
  return null;
};

// Amount validation checker
const validateAmountString = (amountStr: string): string | null => {
  const trimmed = amountStr.trim();
  if (trimmed === '') {
    return 'Amount is required.';
  }
  const parsedAmount = parseFloat(trimmed);
  if (isNaN(parsedAmount) === true) {
    return 'Amount must be a number.';
  }
  if (parsedAmount <= 0) {
    return 'Amount must be greater than 0. Negative values are not allowed.';
  }
  return null;
};

export default function AddExpenseScreen() {
  const router = useRouter();
  const { id: rawId } = useLocalSearchParams<{ id: string }>();
  
  // Get string representation of ID
  let id: string | undefined = undefined;
  if (rawId !== undefined) {
    if (Array.isArray(rawId) === true) {
      id = rawId[0];
    } else {
      id = rawId;
    }
  }

  const store = useExpenseStore();
  const isDark = store.theme === 'dark';

  // Form Field States
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(getTodayString());
  const [notes, setNotes] = useState('');

  // Validation Error States
  const [titleError, setTitleError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  useEffect(() => {
    if (id !== undefined && id !== '') {
      const existingExpense = store.expenses.find((e) => e.id === id);
      if (existingExpense !== undefined) {
        setTitle(existingExpense.title);
        setAmount(existingExpense.amount.toString());
        setCategory(existingExpense.category);
        setDate(existingExpense.date.substring(0, 10)); // Ensure YYYY-MM-DD
        setNotes(existingExpense.notes || '');
      }
    } else {
      // Clear fields if adding new
      setTitle('');
      setAmount('');
      setCategory('Food');
      setDate(getTodayString());
      setNotes('');
    }
    
    // Clear error messages on ID change
    setTitleError(null);
    setAmountError(null);
    setDateError(null);
  }, [id, store.expenses]);

  const handleSave = async () => {
    // Perform validations
    let hasError = false;
    
    // 1. Title
    let tErr = null;
    if (title.trim() === '') {
      tErr = 'Title is required.';
      hasError = true;
    }
    setTitleError(tErr);

    // 2. Amount
    const aErr = validateAmountString(amount);
    if (aErr !== null) {
      hasError = true;
    }
    setAmountError(aErr);

    // 3. Date
    const dErr = validateDateString(date);
    if (dErr !== null) {
      hasError = true;
    }
    setDateError(dErr);

    if (hasError === true) {
      Alert.alert('Validation Failed', 'Please fix the errors in the form before saving.');
      return;
    }

    const parsedAmount = parseFloat(amount);

    if (id !== undefined && id !== '') {
      await store.editExpense(id, title.trim(), parsedAmount, category, date, notes.trim());
      Alert.alert('Success', 'Expense updated successfully!');
      router.push('/list');
    } else {
      await store.addExpense(title.trim(), parsedAmount, category, date, notes.trim());
      Alert.alert('Success', 'Expense added successfully!');
      
      // Reset form fields
      setTitle('');
      setAmount('');
      setCategory('Food');
      setDate(getTodayString());
      setNotes('');
      router.push('/');
    }
  };

  // Determine container and text styles using simple if-else blocks
  let containerStyle = styles.bgLight;
  let textPrimaryStyle = styles.textDark;
  let textSecondaryStyle = styles.textMutedLight;
  let chipBaseStyle = styles.chipLight;

  if (isDark === true) {
    containerStyle = styles.bgDark;
    textPrimaryStyle = styles.textWhite;
    textSecondaryStyle = styles.textMutedDark;
    chipBaseStyle = styles.chipDark;
  }

  // Header Title Text
  let headerTitle = 'Add New Expense';
  let saveBtnLabel = 'Save Expense';
  if (id !== undefined && id !== '') {
    headerTitle = 'Edit Expense';
    saveBtnLabel = 'Update Expense';
  }

  return (
    <ScrollView
      style={[styles.container, containerStyle]}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.header, textPrimaryStyle]}>
        {headerTitle}
      </Text>

      {/* Title */}
      <View>
        <FormInput
          label="Expense Title *"
          placeholder="e.g., Dinner with friends"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            setTitleError(null);
          }}
        />
        {titleError !== null ? (
          <Text style={styles.errorText}>{titleError}</Text>
        ) : null}
      </View>

      {/* Amount */}
      <View>
        <FormInput
          label="Amount ($) *"
          placeholder="e.g., 2200"
          value={amount}
          onChangeText={(text) => {
            setAmount(text);
            setAmountError(null);
          }}
          keyboardType="numeric"
        />
        {amountError !== null ? (
          <Text style={styles.errorText}>{amountError}</Text>
        ) : null}
      </View>

      {/* Date */}
      <View>
        <FormInput
          label="Date (YYYY-MM-DD) *"
          placeholder="e.g., 2026-06-09"
          value={date}
          onChangeText={(text) => {
            setDate(text);
            setDateError(null);
          }}
        />
        {dateError !== null ? (
          <Text style={styles.errorText}>{dateError}</Text>
        ) : null}
      </View>

      {/* Category */}
      <Text style={[styles.label, textPrimaryStyle]}>Category *</Text>
      <View style={styles.categoryContainer}>
        {CATEGORIES.map((cat) => {
          const isSelected = category === cat;
          const activeColor = CATEGORY_COLORS[cat];
          
          let selectedChipStyle = {};
          if (isSelected === true) {
            selectedChipStyle = {
              backgroundColor: activeColor,
              borderColor: activeColor,
            };
          }

          let chipTextStyle = textSecondaryStyle;
          if (isSelected === true) {
            chipTextStyle = styles.activeText;
          }

          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChipBase,
                chipBaseStyle,
                selectedChipStyle,
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.categoryText, chipTextStyle]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Notes */}
      <FormInput
        label="Notes (Optional)"
        placeholder="e.g., Italian restaurant, split bill with friends"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{saveBtnLabel}</Text>
      </TouchableOpacity>

      {/* Cancel Edit Button */}
      {id !== undefined && id !== '' ? (
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.push('/list')}>
          <Text style={[styles.cancelButtonText, textSecondaryStyle]}>Cancel Edit</Text>
        </TouchableOpacity>
      ) : null}
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
    paddingBottom: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 20,
    marginTop: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 6,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
    marginTop: -10,
    marginBottom: 12,
    marginLeft: 2,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryChipBase: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e5e5',
  },
  chipDark: {
    backgroundColor: '#121212',
    borderColor: '#262626',
  },
  categoryText: {
    fontWeight: '600',
    fontSize: 13,
  },
  activeText: {
    color: '#ffffff',
  },
  saveButton: {
    backgroundColor: '#10b981', // Emerald green
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  textWhite: { color: '#ffffff' },
  textDark: { color: '#171717' },
  textMutedLight: { color: '#737373' },
  textMutedDark: { color: '#a3a3a3' },
});