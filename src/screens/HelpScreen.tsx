import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

import { mainContainer, bodyContainer, colors } from '../styles/styles';
import Header from '../components/Header';
import { useTheme } from 'react-native-paper';

const HelpScreen: React.FC = () => {
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
        <Header headerText={'Help'} />
        {/* Main Content */}
        <View style={{ ...bodyContainer.container }}>
          <Text style={{ color: theme.colors.secondary }}>HelpScreen</Text>
        </View>
      </SafeAreaView>
    </>
  );
};

export default HelpScreen;
