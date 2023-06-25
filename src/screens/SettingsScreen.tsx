import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import { mainContainer, bodyContainer } from '../styles/styles';
import Header from '../components/Header';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet } from 'react-native';

const ICON_SIZE = 60;

const settingsOptions = [
  {
    text: 'Account Information',
    iconName: 'account-circle',
    color: '#6495ed',
    textColor: '#000',
  },
  {
    text: 'Preferences',
    iconName: 'tune',
    color: '#3cb371',
    textColor: '#000',
  },
  {
    text: 'Toggle Dark Mode',
    iconName: 'brightness-6',
    color: '#9c9c9c',
    textColor: '#000',
  },
  {
    text: 'Notifications',
    iconName: 'notifications',
    color: '#800080',
    textColor: '#000',
  },
  {
    text: 'Logout',
    iconName: 'exit-to-app',
    color: '#ff7f7f',
    textColor: '#000',
  },
];

const SettingItem = ({ item, toggleSwitch, isDarkMode }) => {
  const theme = useTheme();
  const buttonStyle = {
    ...styles.button,
    backgroundColor: theme.colors.surface,
  };
  const textStyle = { ...styles.text, color: item.textColor };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={item.text === 'Toggle Dark Mode' ? toggleSwitch : undefined}
    >
      <Icon name={item.iconName} size={ICON_SIZE} color={item.textColor} />
      <Text style={textStyle}>
        {item.text === 'Toggle Dark Mode'
          ? `Toggle ${isDarkMode ? 'Light' : 'Dark'} Mode`
          : item.text}
      </Text>
    </TouchableOpacity>
  );
};

const SettingsScreen: React.FC = () => {
  const theme = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSwitch = useCallback(
    () => setIsDarkMode(previousState => !previousState),
    [],
  );

  const renderItem = useCallback(
    ({ item }) => (
      <SettingItem
        item={item}
        toggleSwitch={toggleSwitch}
        isDarkMode={isDarkMode}
      />
    ),
    [toggleSwitch, isDarkMode],
  );

  return (
    <>
      <SafeAreaView
        style={{
          ...mainContainer.container,
          backgroundColor: theme.colors.background,
        }}
      >
        {/* Header */}
        <Header headerText={'Settings'} />
        {/* Main Content */}
        <View style={bodyContainer.container}>
          <FlatList
            data={settingsOptions}
            renderItem={renderItem}
            keyExtractor={item => item.text}
            numColumns={1}
            contentContainerStyle={{ flexGrow: 1 }} // updated line
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    margin: 5,
    marginBottom: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // for Android
  },
  text: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
