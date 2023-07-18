import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { mainContainer, colors } from '../styles/styles';
import {
  useNavigation,
  NavigationProp,
  useIsFocused,
} from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { showToast } from '../util/action';
import ApptDialog from '../components/ApptDialog';

type ScreenList = {
  DashboardScreen: undefined;
  DriverDashboardScreen: undefined;
  RegisterScreen: undefined;
};

interface DecodedToken {
  role_id: number;
}

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const isFocused = useIsFocused();
  const navigation = useNavigation<NavigationProp<ScreenList>>();
  const theme = useTheme();

  // Check timezone
  const checkTimeZone = () => {
    const today = new Date();
    today.getTimezoneOffset() !== -480
      ? setIsDialogVisible(true)
      : setIsDialogVisible(false);
  };

  useEffect(() => {
    checkTimeZone();
  }, [isFocused]);

  const handleLogin = async () => {
    // Check if username and password are empty
    if (username === '' || password === '') {
      showToast('Please enter username and password');
      return;
    }

    try {
      const response = await axios.post(
        'https://itp3111.as.r.appspot.com/login',
        {
          username,
          password,
        },
      );

      if (response.status === 200) {
        const { access_token } = response.data;

        // Store the access token in AsyncStorage
        await AsyncStorage.setItem('access_token', access_token);

        // Decode the access token to get the user's role
        const decodedToken: DecodedToken = jwt_decode(access_token);

        // Check the user's role and navigate accordingly
        if (decodedToken.role_id === 2) {
          // User
          navigation.navigate('DashboardScreen');
        } else if (decodedToken.role_id === 3) {
          // Driver
          navigation.navigate('DriverDashboardScreen');
        }
      } else {
        // Handle authentication error
        const { message } = response.data;
        showToast('Authentication Error' + message);
      }
    } catch (error: any) {
      // Handle network or request error
      if (error.response && error.response.status === 401) {
        showToast('Invalid credentials');
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error
      ) {
        showToast('Error: ' + error.message);
      } else {
        showToast('Unknown error occurred: ' + error);
      }
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
        {/* Main Content */}
        <View style={styles.container}>
          {/* Header */}
          <Text style={{ ...styles.headerText, color: theme.colors.secondary }}>
            Login Now
          </Text>
          {/* Form */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={{ ...styles.input, color: theme.colors.secondary }}
              placeholder="Enter Username..."
              value={username}
              onChangeText={text => setUsername(text)}
              placeholderTextColor={theme.colors.secondary}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={{ ...styles.input, color: theme.colors.secondary }}
              placeholder="Enter Password..."
              secureTextEntry
              value={password}
              onChangeText={text => setPassword(text)}
              placeholderTextColor={theme.colors.secondary}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('RegisterScreen')}
          >
            <Text
              style={{
                color: theme.colors.secondary,
                marginTop: 20,
                fontSize: 22,
              }}
            >
              Don't have an account? 
              <Text style={{textDecorationLine: 'underline'}}> Register Here</Text>
            </Text> 
          </TouchableOpacity>
        </View>
        {/* Dialogbox */}
        {isDialogVisible && (
          <ApptDialog
            appt={null}
            btnMessage={'Change Timezone'}
            onClose={() => checkTimeZone()}
          />
        )}
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
  inputContainer: {
    width: '100%',
    marginBottom: 10,
  },
  label: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 20,
  },
  button: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
});

export default LoginScreen;
