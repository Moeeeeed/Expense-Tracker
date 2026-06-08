import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useExpenseStore } from '../../src/store/useExpenseStore';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={22} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const store = useExpenseStore();
  const isDark = store.theme === 'dark';

  // 1. Resolve colors using simple if-else blocks instead of inline ternaries
  let activeColor = '#10b981'; // Light mode active active highlight: Emerald Green
  let inactiveColor = '#737373'; // Light mode inactive
  let tabBgColor = '#ffffff'; // White tab bar background
  let tabBorderColor = '#e5e5e5'; // Light gray border
  let headerBgColor = '#ffffff';
  let headerTitleColor = '#171717';

  if (isDark === true) {
    activeColor = '#ffffff'; // Dark mode active: Plain White
    inactiveColor = '#737373'; // Dark mode inactive: Slate Gray
    tabBgColor = '#000000'; // Pure Black background
    tabBorderColor = '#262626'; // Dark gray border
    headerBgColor = '#000000'; // Pure Black header background
    headerTitleColor = '#ffffff'; // Plain White text
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: tabBgColor,
          borderTopColor: tabBorderColor,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: headerBgColor,
          borderBottomWidth: 1,
          borderBottomColor: tabBorderColor,
        },
        headerTitleStyle: {
          fontWeight: '700',
          color: headerTitleColor,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <TabBarIcon name="dashboard" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Add Expense',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus-circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: 'All Expenses',
          tabBarIcon: ({ color }) => <TabBarIcon name="list-alt" color={color} />,
          tabBarBadge: store.unreadCount > 0 ? store.unreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#ef4444',
            color: '#ffffff',
            fontSize: 10,
            lineHeight: 14,
          },
        }}
      />
    </Tabs>
  );
}
