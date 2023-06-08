import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { mainContainer, bodyContainer, colors } from '../styles/styles';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker } from 'react-native-maps';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import { Platform, PermissionsAndroid } from 'react-native';

//Get: User's today's appointment
const todaysAppt = {
  id: 1,
  name: 'Medical @TTSH1',
  location: 'Tan Tock Seng Hospital-1',
  time: '08:00 am',
};

//Get: User's upcoming appointment
const upcomingAppt = [
  {
    id: 1,
    name: 'Medical @TTSH2',
    location: 'Tan Tock Seng Hospital-2',
    time: '09:00 am',
  },
  {
    id: 2,
    name: 'Medical @TTSH3',
    location: 'Tan Tock Seng Hospital-3',
    time: '10:00 am',
  },
  {
    id: 3,
    name: 'Medical @TTSH4',
    location: 'Tan Tock Seng Hospital-4',
    time: '11:00 am',
  },
];

interface CurrentLocation {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const DashboardScreen: React.FC = () => {
  const [mapContainer, setMapContainer] = useState(false);
  const [currentLocation, setCurrentLocation] =
    useState<CurrentLocation | null>(null);

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
        granted = (permission === PermissionsAndroid.RESULTS.GRANTED);
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

  // Update the current location
  const handleLocationUpdate = (position: GeoPosition) => {
    const { latitude, longitude } = position.coords;
    setCurrentLocation({
      latitude,
      longitude,
      latitudeDelta: 0.04,
      longitudeDelta: 0.04,
    });
  };

  //Get the initial location
  useEffect(() => {
    getCurrentLocation();

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

  const callRobotHandler = () => {
    setMapContainer(true);
  };

  return (
    <>
      <SafeAreaView style={mainContainer.container}>
        {/* Header */}
        <Header headerText={'Hi Joe !'} home={true} />
        {/* Main Content */}
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
        <ScrollView style={bodyContainer.container}>
          {/* Today's Appointment Card */}
          <View style={styles.cardContainer}>
            <Text style={styles.cardHeading}>Today's Appointment</Text>
            <View style={styles.border} />
            <ApptCardRow appt={[todaysAppt]} />

            <TouchableOpacity style={styles.cardBtn} onPress={callRobotHandler}>
              <Text style={styles.cardBtnText}>Call Robot</Text>
            </TouchableOpacity>
          </View>
          {/* Upcoming  Appointment Card */}
          <View style={styles.cardContainer}>
            <Text style={styles.cardHeading}>Upcoming Appointment</Text>
            <View style={styles.border} />
            <ApptCardRow appt={upcomingAppt} />
          </View>
        </ScrollView>
      </SafeAreaView>
      {/* Bottom Nav */}
      <BottomNav activeRoute={'DashboardScreen'} />
    </>
  );
};

interface Appointment {
  id: number;
  name: string;
  location: string;
  time: string;
}

interface ApptCardRowProps {
  appt: Appointment[];
}

const ApptCardRow: React.FC<ApptCardRowProps> = ({ appt }) => (
  <>
    {appt.map(item => (
      <View key={item.id} style={styles.cardRow}>
        <Icon
          size={30}
          name="calendar-today"
          style={styles.cardIcon}
          color={colors.white}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.cardText}>{item.name}</Text>
          <Text>{item.location}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardText}> {item.time}</Text>
        </View>
      </View>
    ))}
  </>
);

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 15,
    backgroundColor: colors.white,
    elevation: 5,
    padding: 10,
    marginBottom: 20,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    paddingBottom: 10,
  },
  cardHeading: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  cardInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  cardText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardIcon: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    padding: 10,
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
});

export default DashboardScreen;
