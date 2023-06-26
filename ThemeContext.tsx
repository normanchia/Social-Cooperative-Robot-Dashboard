import React from 'react';
import { ColorSchemeName } from 'react-native';

export const ThemeContext = React.createContext<{
  colorScheme: ColorSchemeName;
  setTheme: (colorScheme: ColorSchemeName) => void;
}>({
  colorScheme: 'light',
  setTheme: colorScheme => console.warn('no theme provider'),
});
