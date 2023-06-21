import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { mainContainer, bodyContainer, colors } from '../../styles/styles';
import Header from '../../components/Header';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

type ScreenList = {
  LoginScreen: undefined;
};

const DriverDashboardScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ScreenList>>();
  const theme = useTheme();
  const [robotLogs, setRobotLogs] = useState<string[]>([]);

  const handleLogout = () => {
    // Perform logout
    navigation.navigate('LoginScreen');
  };

  useEffect(() => {
    const generateRobotLogs = () => {
      // Temp Data
      const status = [
        'picked up user at station',
        'moving user to station',
        'drop off user at station',
      ];
      const logs = [];
      for (let i = 1; i <= 25; i++) {
        const statusIndex = Math.floor(Math.random() * status.length);
        const log = `Robot ${i}: ${status[statusIndex]} ${String.fromCharCode(
          65 + i,
        )}`;
        logs.push(log);
      }
      setRobotLogs(logs);
    };

    generateRobotLogs();
  }, []);

  return (
    <>
      <SafeAreaView
        style={{
          ...mainContainer.container,
          backgroundColor: theme.colors.background,
        }}
      >
        {/* Header */}
        <Header headerText={'Driver Dashboard'} home={true} />
        {/* Logout Button */}
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutBtn}>Logout</Text>
        </TouchableOpacity>
        {/* Main Content */}
        <View style={bodyContainer.container}>
          <Text style={{ ...styles.headerText, color: theme.colors.secondary }}>
            Robot Status Log
          </Text>
          <ScrollView>
            {robotLogs.map((log, index) => (
              <Text
                key={index}
                style={{ ...styles.logText, color: theme.colors.secondary }}
              >
                {log}
              </Text>
            ))}
          </ScrollView>
        </View>
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
  logoutBtn: {
    color: colors.white,
    borderRadius: 5,
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  logText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default DriverDashboardScreen;
