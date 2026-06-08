import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface CustomSplashProps {
  onAnimationComplete: () => void;
  duration?: number;
}

export const CustomSplash = ({ onAnimationComplete, duration = 2500 }: CustomSplashProps) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Use ref to keep the completion handler stable and prevent timer restarts on re-renders
  const onCompleteRef = useRef(onAnimationComplete);
  useEffect(() => {
    onCompleteRef.current = onAnimationComplete;
  }, [onAnimationComplete]);

  useEffect(() => {
    // Start entry spring scale animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 10,
      friction: 4,
    }).start();

    // Fade out timer
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onCompleteRef.current();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, fadeAnim, scaleAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Animated.View style={[styles.logoContainer, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.iconWrapper}>
          <FontAwesome name="credit-card" size={48} color="#ffffff" />
        </View>
        <Text style={styles.title}>INNOVAXEL</Text>
        <Text style={styles.subtitle}>Expense Tracker</Text>
      </Animated.View>

      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#3b82f6" style={styles.spinner} />
        <Text style={styles.footerText}>Smart Financial Control</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000', // Pure black splash screen background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6', // Blue brand color
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#a3a3a3',
    letterSpacing: 1.5,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  spinner: {
    marginBottom: 12,
  },
  footerText: {
    fontSize: 13,
    color: '#737373',
    letterSpacing: 0.5,
  },
});
