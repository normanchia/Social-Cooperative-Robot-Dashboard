import React from 'react';
import { StatusBar, StyleSheet, useWindowDimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import {
  DashboardScreen,
  AddAppointmentScreen,
  AppointmentScreen,
  CallScreen,
  SettingsScreen,
  LoginScreen,
  HelpScreen,
  DriverDashboardScreen,
  RegisterScreen,
  GettingStartedHelpScreen,
  AccountHelpScreen,
  AppointmentHelpScreen,
  RequestHelpScreen,
} from './screens';

const Drawer = createDrawerNavigator();
/**
 * TODO:- Temporarily using r-nav-stack instead of r-nav-native-stack cause of following issue:
 * https://github.com/react-navigation/react-navigation/issues/10941
 * Replace with r-nav-native-stack, once this is fixed.
 */
const Stack = createStackNavigator();
// const Stack = createNativeStackNavigator();

export default () => {
  return (
    <>
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent
      />

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
        <Stack.Screen name="Hotel" component={HotelHomeScreen} />
        <Stack.Group>
          <Stack.Screen name="DesignCourse" component={HomeDesignCourse} />
          <Stack.Screen name="CourseInfo" component={CourseInfoScreen} />
        </Stack.Group>
        <Stack.Screen
          name="onBoarding"
          component={IntroductionAnimationScreen}
        /> */}
        {/* Login Screen */}
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        {/* Register Screen */}
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        {/* Driver Dashboard Screen */}
        <Stack.Screen
          name="DriverDashboardScreen"
          component={DriverDashboardScreen}
        />
        {/* Help Screen */}
        <Stack.Screen name="HelpScreen" component={HelpScreen} />
        <Stack.Group>
          <Stack.Screen
            name="GettingStartedHelpScreen"
            component={GettingStartedHelpScreen}
          />
          <Stack.Screen
            name="AccountHelpScreen"
            component={AccountHelpScreen}
          />
          <Stack.Screen
            name="AppointmentHelpScreen"
            component={AppointmentHelpScreen}
          />
          <Stack.Screen
            name="RequestHelpScreen"
            component={RequestHelpScreen}
          />
        </Stack.Group>
        {/* Dashboard Screen */}
        <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
        {/* Add Appointment Screen */}
        <Stack.Screen
          name="AddAppointmentScreen"
          component={AddAppointmentScreen}
        />
        {/* Appointment Screen */}
        <Stack.Screen name="AppointmentScreen" component={AppointmentScreen} />
        {/* Call Screen */}
        <Stack.Screen name="CallScreen" component={CallScreen} />
        {/* Settings Screen */}
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      </Stack.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  drawerSceneContainer: {
    elevation: 24,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
  },
});
