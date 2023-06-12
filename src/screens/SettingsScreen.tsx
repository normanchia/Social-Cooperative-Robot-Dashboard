import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

import { mainContainer, bodyContainer } from '../styles/styles';
import Header from '../components/Header';

const SettingsScreen: React.FC = () => {
  return (
    <>
      <SafeAreaView style={mainContainer.container}>
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
