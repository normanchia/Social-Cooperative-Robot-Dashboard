import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { colors } from '../styles/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface BottomNavProps {
  activeRoute?: string;
}

type ScreenList = {
  DashboardScreen: undefined;
  AppointmentScreen: undefined;
  CallScreen: undefined;
  SettingsScreen: undefined;
};

const BottomNav: React.FC<BottomNavProps> = ({
  activeRoute = 'DashboardScreen',
}) => {
  const navigation = useNavigation<NavigationProp<ScreenList>>();

  const navigationHandler = (route: number) => {
    switch (route) {
      case 1:
        navigation.navigate('DashboardScreen');
        break;
      case 2:
        navigation.navigate('AppointmentScreen');
        break;
      case 3:
        navigation.navigate('CallScreen');
        break;
      case 4:
        navigation.navigate('SettingsScreen');
        break;
      default:
        break;
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.navRow}>
        {/* Home */}
        <TouchableOpacity
          onPress={() => navigationHandler(1)}
          style={styles.navIconContainer}
        >
          <Icon
            size={35}
            name="home"
            style={styles.navIcon}
            color={
              activeRoute === 'DashboardScreen' ? colors.primary : colors.black
            }
          />
          <Text
            style={
              activeRoute === 'HomeScreen'
                ? styles.activeNavIconText
                : styles.navIconText
            }
          >
            Home
          </Text>
        </TouchableOpacity>
        {/* Calendar */}
        <TouchableOpacity
          onPress={() => navigationHandler(2)}
          style={styles.navIconContainer}
        >
          <Icon
            size={35}
            name="calendar-today"
            style={styles.navIcon}
            color={
              activeRoute === 'AppointmentScreen'
                ? colors.primary
                : colors.black
            }
          />
          <Text
            style={
              activeRoute === 'AppointmentScreen'
                ? styles.activeNavIconText
                : styles.navIconText
            }
          >
            Appt
          </Text>
        </TouchableOpacity>
        {/* Call */}
        <TouchableOpacity
          onPress={() => navigationHandler(3)}
          style={styles.navIconContainer}
        >
          <Icon
            size={35}
            name="phone"
            style={styles.navIcon}
            color={activeRoute === 'CallScreen' ? colors.primary : colors.black}
          />
          <Text
            style={
              activeRoute === 'CallScreen'
                ? styles.activeNavIconText
                : styles.navIconText
            }
          >
            Call
          </Text>
        </TouchableOpacity>
        {/* Settings */}
        <TouchableOpacity
          onPress={() => navigationHandler(4)}
          style={styles.navIconContainer}
        >
          <Icon
            size={35}
            name="settings"
            style={styles.navIcon}
            color={
              activeRoute === 'SettingsScreen' ? colors.primary : colors.black
            }
          />
          <Text
            style={
              activeRoute === 'SettingsScreen'
                ? styles.activeNavIconText
                : styles.navIconText
            }
          >
            settings
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderTopWidth: 0.8,
    borderTopColor: '#ccc',
    backgroundColor: colors.white,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  navIconContainer: {
    alignItems: 'center',
  },
  navIcon: { backgroundColor: colors.white },
  navIconText: {
    fontWeight: 'bold',
    paddingTop: 10,
    color: colors.black,
  },
  activeNavIconText: {
    fontWeight: 'bold',
    paddingTop: 10,
    color: colors.primary,
  },
});

export default BottomNav;
