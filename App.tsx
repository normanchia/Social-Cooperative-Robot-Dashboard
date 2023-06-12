import React from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppControlFlow from './src/AppControlFlow';

import { CustomLightTheme, CustomDarkTheme } from './src/themes/CustomThemes';

const App = () => {
  const colorScheme: ColorSchemeName = Appearance.getColorScheme();
  const theme = colorScheme === 'dark' ? CustomDarkTheme : CustomLightTheme;

  return (
    <PaperProvider theme={theme}>
      <AppControlFlow />
    </PaperProvider>
  );
};

export default App;
