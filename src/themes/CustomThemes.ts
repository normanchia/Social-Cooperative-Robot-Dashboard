import { DefaultTheme } from 'react-native-paper';

export const CustomLightTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: 'blue',
    accent: 'yellow',
  },
};

export const CustomDarkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: 'black',
    accent: 'red',
    background: '#000',
    surface: '#121212',
    text: '#fff',
  },
};
