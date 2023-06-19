import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from 'react-native-paper';

import { mainContainer, bodyContainer, colors } from '../styles/styles';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import MapView, { Marker } from 'react-native-maps';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import { Platform, PermissionsAndroid } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { isSameDay, parse } from 'date-fns';
import ApptCardRow from '../components/ApptCardRow';

type ScreenList = {
  LoginScreen: undefined;
};

interface CurrentLocation {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface Appointment {
  appointment_id: number;
  hospital_id: number;
  appointment_time: number;
  appointment_date: string;
  appointment_title: string;
}

const DashboardScreen: React.FC = () => {
  //States
  const [mapContainer, setMapContainer] = useState(false);
  const [currentLocation, setCurrentLocation] =
    useState<CurrentLocation | null>(null);
  const [showWaitingModal, setShowWaitingModal] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  //Variables
  const theme = useTheme(); // use the theme hook
  const navigation = useNavigation<NavigationProp<ScreenList>>();

  //Handlers
  //Get the user's current location
  const getCurrentLocation = async () => {
    try {
      let granted = false;
      if (Platform.OS === 'android') {
        const permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location.',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          },
        );
        granted = permission === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        // iOS Permission request
        Geolocation.requestAuthorization('whenInUse');
        granted = true;
      }

      //If permission granted, get the current location
      if (granted) {
        Geolocation.getCurrentPosition(
          handleLocationUpdate,
          error => {
            console.log(error);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      } else {
        console.log('Location permission denied');
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Update the current location
  const handleLocationUpdate = (position: GeoPosition) => {
    const { latitude, longitude } = position.coords;
    setCurrentLocation({
      latitude,
      longitude,
      latitudeDelta: 0.04,
      longitudeDelta: 0.04,
    });
  };

  //Logout Handler
  const handleLogout = async () => {
    // Clear the access token from storage
    await AsyncStorage.removeItem('access_token');

    // Navigate to the login screen or any other desired screen
    navigation.navigate('LoginScreen');
  };

  //Call Robot Handler
  const callRobotHandler = () => {
    // Send request to backend to call robot
    //Send Driver's current location

    setMapContainer(true);
    setShowWaitingModal(true);

    // Start waiting timer
    setTimeout(() => {
      setShowWaitingModal(false);
      setMapContainer(false);
    }, 30000);
  };

  // Get User's Appointments
  const fetchAppointments = async (userId: number) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://10.0.2.2:5000/appointment/user/${userId}`,
      );
      if (response.status === 200) {
        const today = new Date();
        console.log(today);
        const filteredAppointments = response.data.filter(
          (appointment: Appointment) =>
            isSameDay(
              parse(
                appointment.appointment_date,
                "EEE, dd MMM yyyy HH:mm:ss 'GMT'",
                new Date(),
              ),
              today,
            ),
        );
        setAppointments(filteredAppointments);
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
    getCurrentLocation();
    getProfile();

    //Watch the location for changes
    const watchId = Geolocation.watchPosition(
      handleLocationUpdate,
      error => {
        console.log(error);
      },
      { enableHighAccuracy: true, distanceFilter: 10 },
    );

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    if (userProfile) {
      fetchAppointments(userProfile.user_id);
      AsyncStorage.setItem('userProfileID', userProfile.user_id.toString()); // Stored locally to use in appt screen
    }
  }, [userProfile]);

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

        {/* Map Container */}
        {mapContainer && (
          <View style={styles.mapContainer}>
            {currentLocation && (
              <MapView
                style={{ alignSelf: 'stretch', height: '100%' }}
                region={currentLocation}
              >
                <Marker coordinate={currentLocation} title="Marker" />
              </MapView>
            )}
          </View>
        )}

        {/* Waiting Modal */}
        <Modal visible={showWaitingModal} transparent={true}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Waiting for available robot...</Text>
          </View>
        </Modal>

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
                    style={{
                      ...styles.cardContainer,
                      backgroundColor: theme.colors.surface,
                    }}
                  >
                    <ApptCardRow appt={[appointment]} />
                    <TouchableOpacity
                      style={{
                        ...styles.cardBtn,
                        backgroundColor: theme.colors.primary,
                      }}
                      onPress={callRobotHandler}
                    >
                      <Text style={styles.cardBtnText}>Call Robot</Text>
                    </TouchableOpacity>
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
  mapContainer: {
    height: 300,
    backgroundColor: 'red',
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
  modalContainer: {
    position: 'absolute',
    top: 60,
    height: 300,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginTop: 140,
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
