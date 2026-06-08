import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ExpenseCard } from '../../src/components/ExpenseCard';
import { SummaryChart } from '../../src/components/SummaryChart';
import { useExpenseStore } from '../../src/store/useExpenseStore';

export default function TabOneScreen() {
  const { expenses, deleteExpense } = useExpenseStore();

  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<SummaryChart expenses={expenses} />}
        renderItem={({ item }) => (
          <ExpenseCard item={item} onDelete={deleteExpense} />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
});