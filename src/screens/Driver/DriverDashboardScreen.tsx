import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Button,
} from 'react-native';

import { mainContainer, bodyContainer, colors } from '../../styles/styles';
import Header from '../../components/Header';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

type ScreenList = {
  LoginScreen: undefined;
};

type StationRequest = {
  id: number;
  user_id: number;
  request_id: number;
};

type DriverRequest = {
  request_id: number;
  user_id: number;
  driver_id: number;
  request_status: number;
};

const DriverDashboardScreen: React.FC = () => {
  //States
  const [userProfile, setUserProfile] = useState<any>(null);
  const [stationID, setStationID] = useState<any>(null);
  const [stationRequests, setStationRequests] = useState<StationRequest[]>([]);
  const [driverRequests, setDriverRequests] = useState<DriverRequest[]>([]);

  //Variables
  const navigation = useNavigation<NavigationProp<ScreenList>>();
  const theme = useTheme();

  const handleLogout = () => {
    // Perform logout
    navigation.navigate('LoginScreen');
  };

  //Get Driver Profile
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

  //GET: Robot Station ID from Address
  const getStationID = async (address: string) => {
    try {
      const response = await axios.get(
        'http://10.0.2.2:5000//robotstation/' + address,
      );
      setStationID(response.data.station_id);
    } catch (error) {
      console.log(error);
    }
  };

  //GET: Get all station requests where status = 0 ( user has reached the station to be picked up)
  const getStationRequests = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:5000/robot_request/station/${stationID}/status/0`,
      );
      setStationRequests(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  //Accept Request
  const acceptRequest = async (requestID: number) => {
    const newDriverRequest = {
      user_id: stationRequests[0].user_id,
      driver_id: userProfile?.user_id,
    };

    try {
      const response = await axios.post(
        'http://10.0.2.2:5000/driver_request',
        newDriverRequest,
      );

      // Fetch the updated driver requests
      getDriverRequests();

      // TODO - Update the station request status to 4 (Fininshed)
    } catch (error) {
      console.log(error);
    }
  };

  //GET: Get all driver requests not completed
  const getDriverRequests = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:5000/driver_request/driver/${userProfile?.user_id}`,
      );
      setDriverRequests(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  //Update Request Status
  const updateRequestStatus = async (requestID: number) => {
    try {
      const currentRequest = driverRequests.find(
        request => request.request_id === requestID,
      );

      if (currentRequest) {
        let newStatus;

        if (currentRequest.request_status === 0) {
          newStatus = 1; // Update from status 0 to 1 (picked up)
        } else if (currentRequest.request_status === 1) {
          newStatus = 2; // Update from status 1 to 2 (in transit)
        } else if (currentRequest.request_status === 2) {
          newStatus = 3; // Update from status 2 to 3 (completed)
        }

        if (newStatus) {
          const updatedRequest = {
            ...currentRequest,
            request_status: newStatus,
          };

          const response = await axios.put(
            `http://10.0.2.2:5000/driver_request/${requestID}`,
            updatedRequest,
          );

          // Update the driver requests state with the updated request
          setDriverRequests(prevRequests =>
            prevRequests.map(request =>
              request.request_id === requestID ? updatedRequest : request,
            ),
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getStatusWord = (status: number) => {
    switch (status) {
      case 0:
        return 'To be Picked Up';
      case 1:
        return 'Picked Up';
      case 2:
        return 'In Transit';
      case 3:
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  // useEffect Hook
  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (userProfile && userProfile.address) {
      getStationID(userProfile.address);
      getDriverRequests();
    }
  }, [userProfile]);

  useEffect(() => {
    if (stationID) {
      getStationRequests();
    }
  }, [stationID]);

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
            Driver for {userProfile?.address}
          </Text>
          {/* Driver Requests */}
          <ScrollView>
            <Text
              style={{
                ...styles.headerText,
                color: theme.colors.secondary,
                fontSize: 24,
              }}
            >
              Driver Requests
            </Text>
            {driverRequests &&
              driverRequests.map(driverrequest => (
                <View
                  key={driverrequest.request_id}
                  style={styles.requestContainer}
                >
                  <Text style={styles.requestStatus}>
                    Request ID: {driverrequest.request_id}
                  </Text>
                  <Text style={styles.requestStatus}>
                    User ID: {driverrequest.user_id}
                  </Text>
                  <Text style={styles.requestStatus}>
                    Status: {getStatusWord(driverrequest.request_status)}
                  </Text>

                  <Button
                    title="Update Status"
                    onPress={() =>
                      updateRequestStatus(driverrequest.request_id)
                    }
                  />
                </View>
              ))}
          </ScrollView>
          {/* Station Requests */}
          <ScrollView>
            <Text
              style={{
                ...styles.headerText,
                color: theme.colors.secondary,
                fontSize: 24,
              }}
            >
              Station Requests
            </Text>
            {stationRequests.map(request => (
              <View key={request.id} style={styles.requestContainer}>
                <Text style={styles.requestStatus}>
                  User ID: {request.user_id}
                </Text>
                <Text style={styles.requestStatus}>Ready be picked Up</Text>
                {/* Display station request details */}
                <Button
                  title="Accept"
                  onPress={() => acceptRequest(request.request_id)}
                />
              </View>
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
  requestContainer: {
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 10,
    marginBottom: 10,
  },
  requestStatus: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default DriverDashboardScreen;
