import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from 'react-native-paper';

import { mainContainer, bodyContainer, colors } from '../styles/styles';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import {
  useNavigation,
  NavigationProp,
  useIsFocused,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { isSameDay } from 'date-fns';
import ApptCardRow from '../components/ApptCardRow';

type ScreenList = {
  LoginScreen: undefined;
};

interface Appointment {
  appointment_id: number;
  hospital_id: number;
  appointment_time: number;
  appointment_date: string;
  appointment_title: string;
}

const DashboardScreen: React.FC = () => {
  //States
  const [userProfile, setUserProfile] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [todayDatem, setTodayDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);

  //Variables
  const theme = useTheme(); // use the theme hook
  const navigation = useNavigation<NavigationProp<ScreenList>>();
  const isFocused = useIsFocused();

  //Logout Handler
  const handleLogout = async () => {
    // Clear the access token from storage
    await AsyncStorage.removeItem('access_token');

    // Navigate to the login screen or any other desired screen
    navigation.navigate('LoginScreen');
  };

  // Get User's Appointments
  const fetchAppointments = async (userId: number) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://10.0.2.2:5000/appointment/user/${userId}`,
      );
      if (response.status === 200) {
        const appointments = response.data;
        const today = new Date();
        setTodayDate(today);

        const todayAppointments = appointments.filter((appointment: any) => {
          const appointmentDate = new Date(appointment.appointment_date);

          // Compare the appointment date with today's date
          return isSameDay(appointmentDate, today);
        });

        console.log('Today:', today);
        console.log("Today's Appointments:", todayAppointments);

        // console log appt time
        // todayAppointments.forEach((appt: any) => {
        //   console.log('appt time:', appt.appointment_time);
        // });

        setAppointments(todayAppointments);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  //Get User Profile
  const getProfile = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      if (accessToken) {
        // Add the access token to the request headers
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${accessToken}`;

        // Make a GET request to the '/profile' route
        const response = await axios.get('http://10.0.2.2:5000/profile');
        setUserProfile(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //useEffect Hook
  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (isFocused && userProfile) {
      fetchAppointments(userProfile.user_id);
      AsyncStorage.setItem('userProfileID', userProfile.user_id.toString()); // Stored locally to use in appt screen
    }
  }, [isFocused, userProfile]);
  return (
    <>
      <SafeAreaView
        style={{
          ...mainContainer.container,
          backgroundColor: theme.colors.background,
        }}
      >
        {/* Header */}
        <Header headerText={'Dashboard'} home={true} />

        {/* Logout Button */}
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutBtn}>Logout</Text>
        </TouchableOpacity>

        <ScrollView
          style={{
            ...bodyContainer.container,
            backgroundColor: theme.colors.background,
          }}
        >
          {/* Today's Appointment Card */}
          <Text style={{ ...styles.headerText, color: theme.colors.secondary }}>
            Today's Appointment
          </Text>

          {isLoading ? (
            <ActivityIndicator
              style={{ marginTop: 20 }}
              size="large"
              color={theme.colors.primary}
            />
          ) : (
            <>
              {/* Appointment Cards */}
              {appointments.length > 0 ? (
                appointments.map(appointment => (
                  <View
                    key={appointment.appointment_id}
                    style={
                      appointment.appointment_time >
                      todayDatem.getHours() * 3600 +
                        todayDatem.getMinutes() * 60
                        ? // AFter current time
                          {
                            ...styles.cardContainerToday,
                            backgroundColor: theme.dark ? '#320B0B' : '#F8DEDE',
                          }
                        : //Before current time
                          {
                            ...styles.cardContainer,
                            backgroundColor: theme.colors.surface,
                          }
                    }
                  >
                    <ApptCardRow appt={[appointment]} />
                  </View>
                ))
              ) : (
                <View
                  style={{
                    ...styles.errorContainer,
                    backgroundColor: theme.colors.surface,
                  }}
                >
                  <Text
                    style={{ ...styles.errorText, color: theme.colors.error }}
                  >
                    No appointments found for today.
                  </Text>
                </View>
              )}
            </>
          )}

          <Text style={{ ...styles.headerText, color: theme.colors.secondary }}>
            Actions
          </Text>
          {/* Bottom Nav */}
          <BottomNav />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 15,
    backgroundColor: colors.white,
    elevation: 5,
    padding: 10,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: colors.primary,
  },

  cardContainerToday: {
    borderRadius: 15,
    elevation: 5,
    padding: 10,
    marginBottom: 20,
    borderColor: '#C52E2E',
    borderWidth: 8,
  },

  cardText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 5,
  },

  cardBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  cardBtnText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
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
  errorContainer: {
    borderRadius: 15,
    backgroundColor: colors.white,
    elevation: 5,
    padding: 10,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: colors.primary,
    height: 200,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DashboardScreen;
