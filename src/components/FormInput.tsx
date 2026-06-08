import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useExpenseStore } from '../store/useExpenseStore';

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'numeric';
  multiline?: boolean;
  numberOfLines?: number;
}

export const FormInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
}: FormInputProps) => {
  const store = useExpenseStore();
  const isDark = store.theme === 'dark';

  // Define clear, simple style variables to avoid complex inline ternary syntax
  let labelStyle = styles.labelLight;
  let inputStyle = styles.inputLight;
  let placeholderColor = '#94a3b8'; // Light gray placeholder

  if (isDark === true) {
    labelStyle = styles.labelDark;
    inputStyle = styles.inputDark;
    placeholderColor = '#737373'; // Darker gray placeholder
  }

  // Adjust inputStyle if it is a multi-line input
  const finalInputStyle: any[] = [styles.inputBase, inputStyle];
  if (multiline === true) {
    finalInputStyle.push(styles.multilineInput);
  }

  return (
    <View style={styles.container}>
      <Text style={labelStyle}>{label}</Text>
      <TextInput
        style={finalInputStyle}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor={placeholderColor}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputBase: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
  },
  labelLight: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#171717', // Neutral off-black
  },
  labelDark: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#ffffff', // Plain white
  },
  inputLight: {
    borderColor: '#e5e5e5', // Clean border
    backgroundColor: '#ffffff', // Plain white
    color: '#171717',
  },
  inputDark: {
    borderColor: '#262626', // Pure black border accent
    backgroundColor: '#121212', // Dark card
    color: '#ffffff',
  },
  multilineInput: {
    height: 90,
    textAlignVertical: 'top',
  },
});