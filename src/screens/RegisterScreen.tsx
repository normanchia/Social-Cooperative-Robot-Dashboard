import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
} from 'react-native';

import { mainContainer, colors } from '../styles/styles';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import axios from 'axios';
import { showToast } from '../util/action';

type ScreenList = {
  LoginScreen: undefined;
};

const RegisterScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('User'); // Default role is 'user'
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigation = useNavigation<NavigationProp<ScreenList>>();
  const theme = useTheme();

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://10.0.2.2:5000/user', {
        username,
        password,
        address,
        role_id: role === 'User' ? 2 : 3, // Set the role_id based on the selected role
      });

      if (response.status === 200) {
        showToast('New user created!');
        navigation.navigate('LoginScreen');
      } else {
        showToast('Registration failed');
      }
    } catch (error) {
      showToast('Unknown error occurred');
      console.log(error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleOptionSelect = (selectedRole: string) => {
    setRole(selectedRole);
    setDropdownOpen(false);
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
          {/* Title */}
          <Text style={{ ...styles.headerText, color: theme.colors.secondary }}>
            Register Here
          </Text>

          {/* Inputs */}

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
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={{ ...styles.input, color: theme.colors.secondary }}
              placeholder="Enter Address..."
              value={address}
              onChangeText={text => setAddress(text)}
              placeholderTextColor={theme.colors.secondary}
            />
          </View>

          {/* Options */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Role</Text>
            <TouchableOpacity
              style={{
                ...styles.input,
                backgroundColor: theme.colors.background,
                justifyContent: 'center', // Align items vertically to center
              }}
              onPress={toggleDropdown}
            >
              <Text
                style={{
                  color: theme.colors.secondary,
                  fontSize: 20,
                }}
              >
                {role}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Dropdown */}
          <Modal visible={isDropdownOpen} transparent>
            <TouchableOpacity
              style={styles.dropdownOverlay}
              activeOpacity={1}
              onPress={toggleDropdown}
            >
              <View
                style={{
                  ...styles.dropdownContainer,
                  backgroundColor: theme.colors.surface,
                }}
              >
                <TouchableOpacity
                  style={styles.dropdownOption}
                  onPress={() => handleOptionSelect('User')}
                >
                  <Text style={{ fontSize: 20, color: theme.colors.secondary }}>
                    User
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownOption}
                  onPress={() => handleOptionSelect('Driver')}
                >
                  <Text style={{ fontSize: 20, color: theme.colors.secondary }}>
                    Driver
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Submit Button */}
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          {/* Navigate to Login Screen */}
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text
              style={{
                color: theme.colors.secondary,
                marginTop: 20,
                fontSize: 24,
              }}
            >
              Have an account? Login
            </Text>
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
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    width: '90%',
  },
  dropdownOption: {
    paddingVertical: 8,
    fontSize: 30,
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
});

export default RegisterScreen;
