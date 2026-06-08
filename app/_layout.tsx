import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { View, StyleSheet } from 'react-native';

import { useExpenseStore } from '../src/store/useExpenseStore';
import { CustomSplash } from '../src/components/CustomSplash';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (loaded === false) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const store = useExpenseStore();

  // Simple if-else block instead of nested ternaries
  let navigationTheme = DefaultTheme;
  if (store.theme === 'dark') {
    navigationTheme = DarkTheme;
  }

  const handleSplashComplete = () => {
    store.setSplashActive(false);
  };

  return (
    <ThemeProvider value={navigationTheme}>
      <View style={styles.container}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>

        {store.isSplashActive === true ? (
          <CustomSplash onAnimationComplete={handleSplashComplete} />
        ) : null}
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
