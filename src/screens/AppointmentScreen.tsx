import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

import { mainContainer, bodyContainer } from '../styles/styles';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const AppointmentScreen: React.FC = () => {
  return (
    <>
      <SafeAreaView style={mainContainer.container}>
        {/* Header */}
        <Header headerText={'Book an appoinment!'} />
        {/* Main Content */}
        <View style={bodyContainer.container}>
          <Text>AppointmentScreen</Text>
        </View>
      </SafeAreaView>
      {/* Bottom Nav */}
      <BottomNav activeRoute={'AppointmentScreen'} />
    </>
  );
};

export default AppointmentScreen;
