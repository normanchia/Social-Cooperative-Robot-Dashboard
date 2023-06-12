import { DefaultTheme } from 'react-native-paper';

export const CustomLightTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2072b3',
    background: '#fff',
    secondary: '#222222',
  },
};

export const CustomDarkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2072b3',
    accent: 'red',
    background: '#222222',
    surface: '#121212',
    secondary: '#ffffff',
  },
};
