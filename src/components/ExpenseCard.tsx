import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Expense } from '../types';
import { formatCurrency, formatDate } from '../utils/helpers';
import { useExpenseStore } from '../store/useExpenseStore';

interface ExpenseCardProps {
  item: Expense;
  onDelete: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#10b981', // Emerald Green instead of orange
  Transport: '#ef4444',
  Utilities: '#06b6d4',
  Entertainment: '#8b5cf6',
  Other: '#737373',
};

export const ExpenseCard = ({ item, onDelete }: ExpenseCardProps) => {
  const router = useRouter();
  const store = useExpenseStore();
  const isDark = store.theme === 'dark';

  const categoryColor = CATEGORY_COLORS[item.category] || '#737373';

  // 1. Determine Card styles
  let cardStyle = styles.cardLight;
  let titleStyle = styles.titleLight;
  let dateStyle = styles.dateLight;
  let amountStyle = styles.amountLight;
  let notesContainerStyle = styles.notesContainerLight;
  let notesTextStyle = styles.notesTextLight;
  let actionBtnStyle = styles.actionBtnLight;

  if (isDark === true) {
    cardStyle = styles.cardDark;
    titleStyle = styles.titleDark;
    dateStyle = styles.dateDark;
    amountStyle = styles.amountDark;
    notesContainerStyle = styles.notesContainerDark;
    notesTextStyle = styles.notesTextDark;
    actionBtnStyle = styles.actionBtnDark;
  }

  // 2. Navigation Handler
  const handleEditPress = () => {
    router.push({ pathname: '/two', params: { id: item.id } });
  };

  const handleDeletePress = () => {
    onDelete(item.id);
  };

  return (
    <View style={[styles.cardBase, cardStyle]}>
      {/* Category accent line on left */}
      <View style={[styles.accentBar, { backgroundColor: categoryColor }]} />

      <View style={styles.contentRow}>
        <View style={styles.leftContent}>
          <Text style={[styles.titleBase, titleStyle]}>
            {item.title}
          </Text>

          <View style={styles.metaRow}>
            <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}15` }]}>
              <Text style={[styles.categoryText, { color: categoryColor }]}>
                {item.category}
              </Text>
            </View>
            <Text style={[styles.dateTextBase, dateStyle]}>
              {formatDate(item.date)}
            </Text>
          </View>

          {item.notes ? (
            <View style={[styles.notesContainerBase, notesContainerStyle]}>
              <FontAwesome
                name="comment-o"
                size={11}
                color={isDark ? '#a3a3a3' : '#737373'}
                style={styles.notesIcon}
              />
              <Text style={[styles.notesTextBase, notesTextStyle]} numberOfLines={2}>
                {item.notes}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.rightContent}>
          <Text style={[styles.amountBase, amountStyle]}>
            {formatCurrency(item.amount)}
          </Text>

          <View style={styles.actionRow}>
            {/* Edit Button */}
            <TouchableOpacity
              onPress={handleEditPress}
              style={[styles.actionButton, actionBtnStyle]}
              activeOpacity={0.7}
            >
              <FontAwesome name="pencil" size={13} color={isDark ? '#ffffff' : '#171717'} />
            </TouchableOpacity>

            {/* Delete Button */}
            <TouchableOpacity
              onPress={handleDeletePress}
              style={[styles.actionButton, actionBtnStyle]}
              activeOpacity={0.7}
            >
              <FontAwesome name="trash-o" size={13} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardBase: {
    flexDirection: 'row',
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e5e5',
  },
  cardDark: {
    backgroundColor: '#121212', // Clean solid dark gray card
    borderColor: '#262626', // Clean black-gray border
  },
  accentBar: {
    width: 5,
    height: '100%',
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  leftContent: {
    flex: 1,
    paddingRight: 10,
  },
  titleBase: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  titleLight: {
    color: '#171717',
  },
  titleDark: {
    color: '#ffffff',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  categoryBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  dateTextBase: {
    fontSize: 12,
    fontWeight: '500',
  },
  dateLight: {
    color: '#737373',
  },
  dateDark: {
    color: '#a3a3a3',
  },
  notesContainerBase: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  notesContainerLight: {
    backgroundColor: '#f5f5f5',
  },
  notesContainerDark: {
    backgroundColor: '#000000', // Pure black inset for notes in dark mode
  },
  notesIcon: {
    marginRight: 6,
    marginTop: 2,
  },
  notesTextBase: {
    fontSize: 11,
    fontStyle: 'italic',
    flex: 1,
  },
  notesTextLight: {
    color: '#737373',
  },
  notesTextDark: {
    color: '#a3a3a3',
  },
  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amountBase: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  amountLight: {
    color: '#171717',
  },
  amountDark: {
    color: '#ffffff',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  actionBtnLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e5e5',
  },
  actionBtnDark: {
    backgroundColor: '#000000',
    borderColor: '#262626',
  },
});