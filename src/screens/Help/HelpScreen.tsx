import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { mainContainer, bodyContainer, colors } from '../../styles/styles';
import Header from '../../components/Header';
import { useTheme } from 'react-native-paper';

type ScreenList = {
  GettingStartedHelpScreen: undefined;
  AppointmentHelpScreen: undefined;
  RequestHelpScreen: undefined;
  AccountHelpScreen: undefined;
};

const HelpScreen: React.FC = () => {
  const theme = useTheme(); // use the theme hook
  const navigation = useNavigation<NavigationProp<ScreenList>>();

  const navigationHandler = (route: number) => {
    switch (route) {
      case 1:
        navigation.navigate('GettingStartedHelpScreen');
        break;
      case 2:
        navigation.navigate('AppointmentHelpScreen');
        break;
      case 3:
        navigation.navigate('RequestHelpScreen');
        break;
      case 4:
        navigation.navigate('AccountHelpScreen');
        break;
      default:
        break;
    }
  };
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
        <View style={bodyContainer.container}>
          <Text style={{ ...styles.headerText, color: theme.colors.secondary }}>
            How can we help you?
          </Text>
          {/* Buttons */}
          <View style={styles.container}>
            <TouchableOpacity
              style={{
                ...styles.button,
                backgroundColor: theme.colors.surface,
              }}
              onPress={() => navigationHandler(1)}
            >
              <View style={styles.buttonContent}>
                <Icon size={80} name="flag" color={theme.colors.secondary} />
                <Text
                  style={{
                    ...styles.buttonText,
                    color: theme.colors.secondary,
                  }}
                >
                  Getting Started
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...styles.button,
                backgroundColor: theme.colors.surface,
              }}
              onPress={() => navigationHandler(2)}
            >
              <View style={styles.buttonContent}>
                <Icon
                  size={80}
                  name="calendar-today"
                  color={theme.colors.secondary}
                />
                <Text
                  style={{
                    ...styles.buttonText,
                    color: theme.colors.secondary,
                  }}
                >
                  Appoinment Help
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
            <TouchableOpacity
              style={{
                ...styles.button,
                backgroundColor: theme.colors.surface,
              }}
              onPress={() => navigationHandler(3)}
            >
              <View style={styles.buttonContent}>
                <Icon size={80} name="phone" color={theme.colors.secondary} />
                <Text
                  style={{
                    ...styles.buttonText,
                    color: theme.colors.secondary,
                  }}
                >
                  Request Help
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...styles.button,
                backgroundColor: theme.colors.surface,
              }}
              onPress={() => navigationHandler(4)}
            >
              <View style={styles.buttonContent}>
                <Icon
                  size={80}
                  name="settings"
                  color={theme.colors.secondary}
                />
                <Text
                  style={{
                    ...styles.buttonText,
                    color: theme.colors.secondary,
                  }}
                >
                  Account Help
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 170,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    margin: 5,
    elevation: 5,
  },
  buttonContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.black,
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HelpScreen;
