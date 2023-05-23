import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

import { mainContainer, bodyContainer } from '../styles/styles';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

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
      {/* Bottom Nav */}
      <BottomNav activeRoute={'SettingsScreen'} />
    </>
  );
};

export default SettingsScreen;
