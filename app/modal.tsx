import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useExpenseStore } from '../src/store/useExpenseStore';

export default function ModalScreen() {
  const store = useExpenseStore();
  const isDark = store.theme === 'dark';

  // Define clear theme styles
  let containerStyle = styles.bgLight;
  let textStyle = styles.textDark;
  let separatorStyle = styles.sepLight;

  if (isDark === true) {
    containerStyle = styles.bgDark;
    textStyle = styles.textWhite;
    separatorStyle = styles.sepDark;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.title, textStyle]}>App Information</Text>
      <View style={[styles.separator, separatorStyle]} />
      <Text style={[styles.description, textStyle]}>
        Personal Expense Tracking Service.
      </Text>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  bgLight: {
    backgroundColor: '#ffffff',
  },
  bgDark: {
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
  },
  sepLight: {
    backgroundColor: '#e5e5e5',
  },
  sepDark: {
    backgroundColor: '#262626',
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  textWhite: { color: '#ffffff' },
  textDark: { color: '#171717' },
});
