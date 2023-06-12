import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { mainContainer, colors } from '../styles/styles';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

type ScreenList = {
  DashboardScreen: undefined;
  DriverDashboardScreen: undefined;
};

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<NavigationProp<ScreenList>>();
  const theme = useTheme();

  const handleLogin = () => {
    // Perform login authentication here
    navigation.navigate('DashboardScreen');
  };

  //For testing purposes
  const handleDriverLogin = () => {
    // Perform login authentication here
    navigation.navigate('DriverDashboardScreen');
  };

  return (
    <>
      <SafeAreaView
        style={{
          ...mainContainer.container,
          backgroundColor: theme.colors.background,
        }}
      >
        {/* Main Content */}
        <View style={styles.container}>
          <Text style={{ ...styles.headerText, color: theme.colors.secondary }}>
            Login to your account
          </Text>
          <TextInput
            style={{ ...styles.input, color: theme.colors.secondary }}
            placeholder="Username"
            value={username}
            onChangeText={text => setUsername(text)}
            placeholderTextColor={theme.colors.secondary}
          />
          <TextInput
            style={{ ...styles.input, color: theme.colors.secondary }}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={text => setPassword(text)}
            placeholderTextColor={theme.colors.secondary}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleDriverLogin}>
            <Text style={styles.buttonText}>Driver Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default LoginScreen;
