import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

// 1. We define the strict rules for what this component needs to function
interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'numeric'; // Optional: defaults to standard keyboard
}

// 2. The Component Module
export const FormInput = ({ label, value, onChangeText, placeholder, keyboardType = 'default' }: FormInputProps) => {
  return (
    <View style={styles.container}>
      {/* Displays the label above the input */}
      <Text style={styles.label}>{label}</Text>
      
      {/* The actual text box the user types into */}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor="#999"
      />
    </View>
  );
};

// 3. The isolated styling for just this module
const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});