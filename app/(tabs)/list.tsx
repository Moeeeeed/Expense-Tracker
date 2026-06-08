import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { ExpenseCard } from '../../src/components/ExpenseCard';
import { useExpenseStore } from '../../src/store/useExpenseStore';

const CATEGORIES = ['All', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Other'];

export default function ListScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const store = useExpenseStore();
  const isDark = store.theme === 'dark';

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Clear unread badge count when tab is focused (using standard useNavigation listener)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      store.clearUnreadCount();
    });
    return unsubscribe;
  }, [navigation, store]);

  // Filter & Sort Logic using beginner-friendly plain statements
  const filteredExpenses = store.expenses.filter((item) => {
    // 1. Filter by Title Search Query
    if (searchQuery.trim() !== '') {
      const titleLower = item.title.toLowerCase();
      const queryLower = searchQuery.toLowerCase();
      if (titleLower.includes(queryLower) === false) {
        return false;
      }
    }

    // 2. Filter by Category
    if (selectedCategory !== 'All') {
      if (item.category !== selectedCategory) {
        return false;
      }
    }

    // 3. Filter by Date Range
    if (showDateFilter === true) {
      if (item.date === undefined || item.date === null || item.date === '') {
        return false;
      }
      
      const itemTime = new Date(item.date).getTime();
      if (isNaN(itemTime) === true) {
        return false;
      }
      
      if (startDate.trim() !== '') {
        const startTime = new Date(startDate).getTime();
        if (isNaN(startTime) === false) {
          if (itemTime < startTime) {
            return false;
          }
        }
      }
      
      if (endDate.trim() !== '') {
        const endTime = new Date(endDate).getTime();
        if (isNaN(endTime) === false) {
          // Add 24 hours in milliseconds to include the entire end date day
          if (itemTime > endTime + 86400000) {
            return false;
          }
        }
      }
    }

    return true;
  });

  // Sort expenses: most recent first
  filteredExpenses.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setStartDate('');
    setEndDate('');
    setShowDateFilter(false);
  };

  // Determine container, card and text styles via clean if-else blocks
  let containerStyle = styles.bgLight;
  let cardStyle = styles.cardLight;
  let inputStyle = styles.inputLight;
  let textPrimaryStyle = styles.textDark;
  let textSecondaryStyle = styles.textMutedLight;
  let chipBaseStyle = styles.chipLight;
  
  let searchIconColor = '#94a3b8';
  let dateToggleColor = '#3b82f6';

  if (isDark === true) {
    containerStyle = styles.bgDark;
    cardStyle = styles.cardDark;
    inputStyle = styles.inputDark;
    textPrimaryStyle = styles.textWhite;
    textSecondaryStyle = styles.textMutedDark;
    chipBaseStyle = styles.chipDark;
    
    searchIconColor = '#737373';
    dateToggleColor = '#ffffff';
  }

  // Active Date Toggle styles
  let dateToggleBtnStyle = [styles.dateFilterToggle, cardStyle];
  if (showDateFilter === true) {
    dateToggleBtnStyle = [styles.dateFilterToggle, cardStyle, styles.activeDateFilterToggle];
    dateToggleColor = '#ffffff';
  }

  // Check if we show "Clear Filters" button
  let showClearBtn = false;
  if (searchQuery !== '' || selectedCategory !== 'All' || startDate !== '' || endDate !== '') {
    showClearBtn = true;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Search and Date Filter Row */}
      <View style={styles.searchSection}>
        <View style={[styles.searchContainer, cardStyle]}>
          <FontAwesome name="search" size={14} color={searchIconColor} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, textPrimaryStyle]}
            placeholder="Search expenses by title..."
            placeholderTextColor={isDark ? '#737373' : '#94a3b8'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <FontAwesome name="times-circle" size={14} color={searchIconColor} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Date Filter Panel Toggle */}
        <TouchableOpacity
          style={dateToggleBtnStyle}
          onPress={() => setShowDateFilter(!showDateFilter)}
        >
          <FontAwesome name="calendar" size={14} color={dateToggleColor} />
        </TouchableOpacity>
      </View>

      {/* Expandable Date Range Inputs Panel */}
      {showDateFilter === true ? (
        <View style={[styles.dateFilterPanel, cardStyle]}>
          <Text style={[styles.panelTitle, textPrimaryStyle]}>
            Filter by Date Range (YYYY-MM-DD)
          </Text>
          <View style={styles.dateInputRow}>
            <View style={styles.dateInputCol}>
              <Text style={[styles.inputLabel, textSecondaryStyle]}>Start Date</Text>
              <TextInput
                style={[styles.dateInput, inputStyle]}
                placeholder="2026-06-01"
                placeholderTextColor={isDark ? '#525252' : '#d4d4d4'}
                value={startDate}
                onChangeText={setStartDate}
              />
            </View>
            <View style={styles.dateInputCol}>
              <Text style={[styles.inputLabel, textSecondaryStyle]}>End Date</Text>
              <TextInput
                style={[styles.dateInput, inputStyle]}
                placeholder="2026-06-30"
                placeholderTextColor={isDark ? '#525252' : '#d4d4d4'}
                value={endDate}
                onChangeText={setEndDate}
              />
            </View>
          </View>
        </View>
      ) : null}

      {/* Horizontal Category Selector Chips */}
      <View style={styles.categoriesWrapper}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(cat) => cat}
          contentContainerStyle={styles.categoriesContent}
          renderItem={({ item: cat }) => {
            const isSelected = selectedCategory === cat;
            
            let selectedChipStyle = {};
            if (isSelected === true) {
              selectedChipStyle = styles.activeChip;
            }

            let chipTextStyle = textSecondaryStyle;
            if (isSelected === true) {
              chipTextStyle = styles.activeChipText;
            }

            return (
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  chipBaseStyle,
                  selectedChipStyle,
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.categoryChipText, chipTextStyle]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Results Subheader */}
      <View style={styles.resultsHeader}>
        <Text style={[styles.resultsCount, textSecondaryStyle]}>
          Showing {filteredExpenses.length} result{filteredExpenses.length === 1 ? '' : 's'}
        </Text>
        {showClearBtn === true ? (
          <TouchableOpacity onPress={handleClearFilters}>
            <Text style={styles.clearFiltersText}>Clear Filters</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome
            name="search-minus"
            size={40}
            color={isDark ? '#404040' : '#e5e5e5'}
            style={styles.emptyIcon}
          />
          <Text style={[styles.emptyText, textPrimaryStyle]}>
            No expenses found
          </Text>
          <Text style={[styles.emptySub, textSecondaryStyle]}>
            Try adjusting your search queries or filter selections.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredExpenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExpenseCard item={item} onDelete={store.deleteExpense} />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
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
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
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
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  dateFilterToggle: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDateFilterToggle: {
    backgroundColor: '#3b82f6', // Blue
    borderColor: '#3b82f6',
  },
  dateFilterPanel: {
    marginHorizontal: 16,
    marginTop: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  panelTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  dateInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dateInputCol: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  dateInput: {
    height: 36,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    fontSize: 12,
    fontWeight: '500',
  },
  inputLight: {
    borderColor: '#e5e5e5',
    backgroundColor: '#ffffff',
    color: '#171717',
  },
  inputDark: {
    borderColor: '#262626',
    backgroundColor: '#000000',
    color: '#ffffff',
  },
  categoriesWrapper: {
    marginTop: 10,
    height: 38,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
  activeChip: {
    backgroundColor: '#3b82f6', // Blue
    borderColor: '#3b82f6',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeChipText: {
    color: '#ffffff',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  clearFiltersText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ef4444',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  textWhite: { color: '#ffffff' },
  textDark: { color: '#171717' },
  textMutedLight: { color: '#737373' },
  textMutedDark: { color: '#a3a3a3' },
});