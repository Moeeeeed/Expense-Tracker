import { Link, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useExpenseStore } from '../src/store/useExpenseStore';

export default function NotFoundScreen() {
  const store = useExpenseStore();
  const isDark = store.theme === 'dark';

  // Define styling variables via simple if-else blocks
  let containerStyle = styles.bgLight;
  let textStyle = styles.textDark;

  if (isDark === true) {
    containerStyle = styles.bgDark;
    textStyle = styles.textWhite;
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={[styles.container, containerStyle]}>
        <Text style={[styles.title, textStyle]}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
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
    fontSize: 18,
    fontWeight: '700',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#10b981', // Emerald green
    fontWeight: '700',
  },
  textWhite: { color: '#ffffff' },
  textDark: { color: '#171717' },
});
