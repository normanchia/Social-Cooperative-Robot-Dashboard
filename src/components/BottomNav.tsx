import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { colors } from '../styles/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

type ScreenList = {
  HelpScreen: undefined;
  AppointmentScreen: undefined;
  CallScreen: undefined;
  SettingsScreen: undefined;
};

const BottomNav: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ScreenList>>();

  const navigationHandler = (route: number) => {
    switch (route) {
      case 1:
        navigation.navigate('AppointmentScreen');
        break;
      case 2:
        navigation.navigate('CallScreen');
        break;
      case 3:
        navigation.navigate('HelpScreen');
        break;
      case 4:
        navigation.navigate('SettingsScreen');
        break;
      default:
        break;
    }
  };
  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={{ ...styles.button, backgroundColor: '#58AF90' }}
          onPress={() => navigationHandler(1)}
        >
          <View style={styles.buttonContent}>
            <Icon size={80} name="calendar-today" color="white" />
            <Text style={styles.buttonText}>Appointment</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigationHandler(2)}
        >
          <View style={styles.buttonContent}>
            <Icon size={80} name="phone" color="white" />
            <Text style={styles.buttonText}>Request Robot</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          style={{ ...styles.button, backgroundColor: '#C52E2E' }}
          onPress={() => navigationHandler(3)}
        >
          <View style={styles.buttonContent}>
            <Icon size={80} name="help" color="white" />
            <Text style={styles.buttonText}>Help</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.button, backgroundColor: '#E99E2F' }}
          onPress={() => navigationHandler(4)}
        >
          <View style={styles.buttonContent}>
            <Icon size={80} name="settings" color="white" />
            <Text style={styles.buttonText}>Settings</Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 170,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    margin: 5,
  },
  buttonContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default BottomNav;
