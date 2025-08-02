import { useColorScheme } from 'react-native';

export type ThemeType = 'light' | 'dark' | 'system';

export interface Theme {
  // Background colors
  background: string;
  surface: string;
  card: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textMuted: string;
  
  // Primary colors
  primary: string;
  primaryText: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  
  // Border colors
  border: string;
  borderLight: string;
  
  // Priority colors
  priorityHigh: string;
  priorityMedium: string;
  priorityLow: string;
  
  // Interactive elements
  button: string;
  buttonText: string;
  input: string;
  inputBorder: string;
  
  // Shadows
  shadow: string;
  shadowColor: string;
}

const lightTheme: Theme = {
  background: '#f5f5f5',
  surface: '#ffffff',
  card: '#ffffff',
  text: '#000000',
  textSecondary: '#666666',
  textMuted: '#999999',
  primary: '#007AFF',
  primaryText: '#ffffff',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  border: '#e0e0e0',
  borderLight: '#f0f0f0',
  priorityHigh: '#e74c3c',
  priorityMedium: '#f1c40f',
  priorityLow: '#2ecc71',
  button: '#007AFF',
  buttonText: '#ffffff',
  input: '#ffffff',
  inputBorder: '#cccccc',
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowColor: '#000000',
};

const darkTheme: Theme = {
  background: '#000000',
  surface: '#1c1c1e',
  card: '#2c2c2e',
  text: '#ffffff',
  textSecondary: '#ebebf5',
  textMuted: '#8e8e93',
  primary: '#0A84FF',
  primaryText: '#ffffff',
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  border: '#38383A',
  borderLight: '#48484A',
  priorityHigh: '#FF453A',
  priorityMedium: '#FF9F0A',
  priorityLow: '#30D158',
  button: '#0A84FF',
  buttonText: '#ffffff',
  input: '#1c1c1e',
  inputBorder: '#38383A',
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowColor: '#000000',
};

export const getTheme = (themeType: ThemeType): Theme => {
  const systemColorScheme = useColorScheme();
  
  if (themeType === 'system') {
    return systemColorScheme === 'dark' ? darkTheme : lightTheme;
  }
  
  return themeType === 'dark' ? darkTheme : lightTheme;
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
}; 