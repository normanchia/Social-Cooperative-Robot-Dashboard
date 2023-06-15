import { DefaultTheme } from 'react-native-paper';

export const CustomLightTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2072b3',
    background: '#ffffff', //Background Color
    secondary: '#222222', //Text Color
    surface: '#ebebeb', //Card Color
  },
};

export const CustomDarkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2072b3',
    background: '#222222', //Background Color
    secondary: '#ffffff', //Text Color
    surface: '#2b2b2b', //Card Color
  },
};
