import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Expense } from '../types';
import { formatCurrency } from '../utils/helpers';
import { useExpenseStore } from '../store/useExpenseStore';

interface SummaryChartProps {
  expenses: Expense[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#10b981', // Emerald
  Transport: '#ef4444', // Red
  Utilities: '#06b6d4', // Cyan
  Entertainment: '#8b5cf6', // Purple
  Other: '#737373', // Gray
};

export const SummaryChart = ({ expenses }: SummaryChartProps) => {
  const store = useExpenseStore();
  const isDark = store.theme === 'dark';

  // Calculate total spent amount
  let totalSpent = 0;
  for (let i = 0; i < expenses.length; i = i + 1) {
    totalSpent = totalSpent + expenses[i].amount;
  }

  // Budget spent gauge calculation
  const budgetLimit = 2000;
  let budgetPercent = 0;
  if (totalSpent > 0) {
    budgetPercent = Math.min(Math.round((totalSpent / budgetLimit) * 100), 100);
  }

  // Calculate circular progress borders dynamically
  let borderLeftColor = 'transparent';
  let borderTopColor = 'transparent';
  let borderRightColor = 'transparent';
  let borderBottomColor = 'transparent';

  if (budgetPercent > 0) {
    borderTopColor = '#3b82f6';
  }
  if (budgetPercent > 25) {
    borderRightColor = '#3b82f6';
  }
  if (budgetPercent > 50) {
    borderBottomColor = '#3b82f6';
  }
  if (budgetPercent > 75) {
    borderLeftColor = '#3b82f6';
  }

  // Create totals map
  const categoryTotals: Record<string, number> = {
    Food: 0,
    Transport: 0,
    Utilities: 0,
    Entertainment: 0,
    Other: 0,
  };

  for (let i = 0; i < expenses.length; i = i + 1) {
    const item = expenses[i];
    let catName = item.category;
    // Fallback if category is missing or invalid
    if (categoryTotals[catName] === undefined) {
      catName = 'Other';
    }
    categoryTotals[catName] = categoryTotals[catName] + item.amount;
  }

  // Generate category chart data
  const categoryData = [];
  const categoriesList = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Other'];
  
  for (let i = 0; i < categoriesList.length; i = i + 1) {
    const cat = categoriesList[i];
    const amount = categoryTotals[cat];
    let percentage = 0;
    if (totalSpent > 0) {
      percentage = (amount / totalSpent) * 100;
    }
    
    categoryData.push({
      category: cat,
      amount: amount,
      percentage: percentage,
      color: CATEGORY_COLORS[cat],
    });
  }

  // Find max category value for chart scaling
  let maxCategoryAmount = 0;
  for (let i = 0; i < categoryData.length; i = i + 1) {
    const amt = categoryData[i].amount;
    if (amt > maxCategoryAmount) {
      maxCategoryAmount = amt;
    }
  }

  // Theme variable selection (Simple if-else blocks instead of complex ternaries)
  let heroCardStyle = styles.heroCardLight;
  let cardStyle = styles.cardLight;
  let textPrimaryStyle = styles.textDark;
  let textSecondaryStyle = styles.textMutedLight;
  let progressBgStyle = styles.progressBgLight;

  if (isDark === true) {
    heroCardStyle = styles.heroCardDark;
    cardStyle = styles.cardDark;
    textPrimaryStyle = styles.textWhite;
    textSecondaryStyle = styles.textMutedDark;
    progressBgStyle = styles.progressBgDark;
  }

  return (
    <View style={styles.container}>
      {/* Total Spent Hero Card */}
      <View style={[styles.heroCardBase, heroCardStyle]}>
        <View style={styles.heroTextContainer}>
          <Text style={[styles.heroTitle, textSecondaryStyle]}>
            Total Amount Spent
          </Text>
          <Text style={[styles.heroAmount, textPrimaryStyle]}>
            {formatCurrency(totalSpent)}
          </Text>
          <Text style={[styles.heroSub, textSecondaryStyle]}>
            From {expenses.length} transaction{expenses.length === 1 ? '' : 's'}
          </Text>
        </View>

        {/* Circular Budget Gauge */}
        <View style={styles.gaugeContainer}>
          <View style={[styles.gaugeCircle, { borderColor: isDark ? '#262626' : '#e5e5e5' }]}>
            <View
              style={[
                styles.gaugeFillSegment,
                {
                  borderTopColor,
                  borderRightColor,
                  borderBottomColor,
                  borderLeftColor,
                  transform: [{ rotate: '45deg' }],
                },
              ]}
            />
            <Text style={[styles.gaugeText, textPrimaryStyle]}>
              {budgetPercent}%
            </Text>
            <Text style={[styles.gaugeSubText, textSecondaryStyle]}>
              Spent
            </Text>
          </View>
        </View>
      </View>

      {/* Visual Chart - Column Chart */}
      <Text style={[styles.sectionTitle, textPrimaryStyle]}>
        Category Overview
      </Text>

      <View style={[styles.chartContainerBase, cardStyle]}>
        <View style={styles.barChartRow}>
          {categoryData.map((data) => {
            // Scale bar height based on max amount, limit to 80% max height
            let barHeightPercentage = 0;
            if (maxCategoryAmount > 0) {
              const fraction = data.amount / maxCategoryAmount;
              barHeightPercentage = fraction * 80;
              // If there is any amount, show a small visual block (minimum 10% height)
              if (data.amount > 0 && barHeightPercentage < 10) {
                barHeightPercentage = 10;
              }
            }

            const formattedHeightStr = `${barHeightPercentage.toFixed(0)}%`;

            // Short category abbreviation
            let label = data.category;
            if (label.length > 5) {
              label = label.substring(0, 5);
            }

            // Compact value label text (e.g. 1.2k)
            let valueLabel = '';
            if (data.amount > 0) {
              if (data.amount >= 1000) {
                valueLabel = `${(data.amount / 1000).toFixed(1)}k`;
              } else {
                valueLabel = `${data.amount}`;
              }
            }

            const trackBg = isDark ? '#262626' : '#f5f5f5';

            return (
              <View key={data.category} style={styles.chartCol}>
                <View style={styles.barWrapper}>
                  {data.amount > 0 ? (
                    <Text style={[styles.barValueText, textPrimaryStyle]}>
                      {valueLabel}
                    </Text>
                  ) : null}
                  <View style={[styles.chartBarTrack, { backgroundColor: trackBg }]}>
                    <View
                      style={[
                        styles.chartBar,
                        {
                          height: formattedHeightStr as any,
                          backgroundColor: data.color,
                        },
                      ]}
                    />
                  </View>
                </View>
                <Text style={[styles.chartLabel, textSecondaryStyle]} numberOfLines={1}>
                  {label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Category Progress List */}
      <Text style={[styles.sectionTitle, textPrimaryStyle]}>
        Category Details
      </Text>

      <View style={[styles.detailsContainerBase, cardStyle]}>
        {categoryData.map((data) => {
          const percentText = `${data.percentage.toFixed(0)}%`;
          const widthStyle = `${data.percentage.toFixed(0)}%`;

          return (
            <View key={data.category} style={styles.progressRow}>
              <View style={styles.progressHeader}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.colorIndicator, { backgroundColor: data.color }]} />
                  <Text style={[styles.categoryName, textPrimaryStyle]}>
                    {data.category}
                  </Text>
                </View>
                <View style={styles.valueInfo}>
                  <Text style={[styles.categoryAmount, textPrimaryStyle]}>
                    {formatCurrency(data.amount)}
                  </Text>
                  <Text style={styles.categoryPercent}>
                    {percentText}
                  </Text>
                </View>
              </View>

              <View style={[styles.progressBarBg, progressBgStyle]}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: widthStyle as any,
                      backgroundColor: data.color,
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  heroCardBase: {
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  gaugeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gaugeCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gaugeFillSegment: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 6,
    borderColor: 'transparent',
  },
  gaugeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  gaugeSubText: {
    fontSize: 8,
    fontWeight: '600',
    marginTop: 1,
    textTransform: 'uppercase',
  },
  heroCardLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e5e5',
  },
  heroCardDark: {
    backgroundColor: '#121212', // Black-gray card in dark mode
    borderColor: '#262626',
  },
  heroTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.0,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  heroAmount: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 11,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 6,
    letterSpacing: 0.2,
  },
  chartContainerBase: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
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
  barChartRow: {
    flexDirection: 'row',
    height: 160,
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingBottom: 6,
  },
  chartCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  chartBarTrack: {
    width: 14,
    height: '100%',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartBar: {
    width: '100%',
    borderRadius: 7,
  },
  barValueText: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
  },
  chartLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 8,
  },
  detailsContainerBase: {
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  progressRow: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
  },
  valueInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '700',
    marginRight: 4,
  },
  categoryPercent: {
    fontSize: 11,
    color: '#8b8b8b',
    fontWeight: '500',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBgLight: {
    backgroundColor: '#f5f5f5',
  },
  progressBgDark: {
    backgroundColor: '#000000', // Pure black bar track
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  textWhite: { color: '#ffffff' },
  textDark: { color: '#171717' },
  textMutedLight: { color: '#737373' },
  textMutedDark: { color: '#a3a3a3' },
});