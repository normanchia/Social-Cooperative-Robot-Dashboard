import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

import { mainContainer, bodyContainer } from '../styles/styles';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const CallScreen: React.FC = () => {
  return (
    <>
      <SafeAreaView style={mainContainer.container}>
        {/* Header */}
        <Header headerText={'Call for a Service!'} />
        {/* Main Content */}
        <View style={bodyContainer.container}>
          <Text>CallScreen</Text>
        </View>
      </SafeAreaView>
      {/* Bottom Nav */}
      <BottomNav activeRoute={'CallScreen'} />
    </>
  );
};

export default CallScreen;
