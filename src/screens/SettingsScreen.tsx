import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

import { mainContainer, bodyContainer } from '../styles/styles';
import Header from '../components/Header';
import { useTheme } from 'react-native-paper';

const SettingsScreen: React.FC = () => {
  const theme = useTheme(); // use the theme hook
  return (
    <>
      <SafeAreaView
        style={{
          ...mainContainer.container,
          backgroundColor: theme.colors.background,
        }}
      >
        {/* Header */}
        <Header headerText={'Settings'} />
        {/* Main Content */}
        <View style={bodyContainer.container}>
          <Text>SettingsScreen</Text>
        </View>
      </SafeAreaView>
    </>
  );
};

export default SettingsScreen;
