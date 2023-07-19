import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { mainContainer, bodyContainer, colors } from '../../styles/styles';
import Header from '../../components/Header';
import { useTheme } from 'react-native-paper';
import { ScrollView } from 'react-native';
import { Image } from 'react-native';

const GettingStartedHelpScreen: React.FC = () => {
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
        <Header headerText={'Getting Started'} />
        {/* Main Content */}
        <ScrollView>
          <View style={{ ...bodyContainer.container }}>
            {/* Header */}
            <Text
              style={{ ...styles.headerText, color: theme.colors.secondary }}
            >
              Here's how to get started:
            </Text>
            {/* Dashboard*/}
            <Text
              style={{ ...styles.sectionHeader, color: theme.colors.secondary }}
            >
              1. Dashboard
            </Text>
            <Text
              style={{
                ...styles.descriptionText,
                color: theme.colors.secondary,
              }}
            >
              The Dashboard displays your appointments for today. You can view
              your{' '}
              <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                upcoming appointments
              </Text>{' '}
              and{' '}
              <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                easily navigate
              </Text>{' '}
              to the various screens.
            </Text>
            <Image
              source={require('../../assets/HelpScreenImg/DashboardScreen.png')}
              style={styles.image}
            />
            {/* Appointment */}
            <Text
              style={{ ...styles.sectionHeader, color: theme.colors.secondary }}
            >
              2. Appointment Screen
            </Text>
            <Text
              style={{
                ...styles.descriptionText,
                color: theme.colors.secondary,
              }}
            >
              The Appointment Screen allows you to{' '}
              <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                view and add
              </Text>{' '}
              appointments. You can manage your schedule and make changes as
              needed.
            </Text>
            <Image
              source={require('../../assets/HelpScreenImg/AppointmentScreen.png')}
              style={styles.image}
            />
            {/* Request */}
            <Text
              style={{ ...styles.sectionHeader, color: theme.colors.secondary }}
            >
              3. Request Screen
            </Text>
            <Text
              style={{
                ...styles.descriptionText,
                color: theme.colors.secondary,
              }}
            >
              The Call Screen allows you to{' '}
              <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                request a robot to guide you
              </Text>{' '}
              to your destination. Simply follow the instructions provided by
              the robot to reach your desired location.
            </Text>
            <Image
              source={require('../../assets/HelpScreenImg/RequestRobotScreen.png')}
              style={styles.image}
            />
            {/* Settings */}
            <Text
              style={{ ...styles.sectionHeader, color: theme.colors.secondary }}
            >
              4. Settings Screen
            </Text>
            <Text
              style={{
                ...styles.descriptionText,
                color: theme.colors.secondary,
              }}
            >
              The Settings Screen allows you to edit your profile information
              and change the app's theme to Dark Mode for better visibility.
            </Text>
            <Image
              source={require('../../assets/HelpScreenImg/SettingScreen.png')}
              style={styles.image}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 20,
    marginBottom: 20,
    lineHeight: 30,
  },
  image: {
    width: 300,
    height: 600,
    alignSelf: 'center',
  },
});

export default GettingStartedHelpScreen;
