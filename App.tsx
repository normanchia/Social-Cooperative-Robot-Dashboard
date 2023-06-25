import React from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppControlFlow from './src/AppControlFlow';

import { CustomLightTheme, CustomDarkTheme } from './src/themes/CustomThemes';

import { ThemeContext } from './ThemeContext';

const App = () => {
  const [colorScheme, setColorScheme] = React.useState<ColorSchemeName>(
    Appearance.getColorScheme(),
  );

  const setTheme = (scheme: ColorSchemeName) => {
    setColorScheme(scheme);
  };

  const theme = colorScheme === 'dark' ? CustomDarkTheme : CustomLightTheme;

  return (
    <ThemeContext.Provider value={{ colorScheme, setTheme }}>
      <PaperProvider theme={theme}>
        <AppControlFlow />
      </PaperProvider>
    </ThemeContext.Provider>
  );
};

export default App;
