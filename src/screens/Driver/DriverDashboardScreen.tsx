import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { mainContainer, bodyContainer, colors } from '../../styles/styles';
import Header from '../../components/Header';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { set } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';

type ScreenList = {
  LoginScreen: undefined;
  DriverProfileScreen: undefined;
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
  const [isLoading, setIsLoading] = useState(false);
  const [refreshPage, setRefreshPage] = useState(false);
  const [stationUsernames, setStationUsernames] = useState<string[]>([]);
  const [driverUsernames, setDriverUsernames] = useState<string[]>([]);

  //Variables
  const navigation = useNavigation<NavigationProp<ScreenList>>();
  const theme = useTheme();

  const handleLogout = async () => {
    // Clear the access token from storage
    await AsyncStorage.removeItem('access_token');

    // Navigate to the login screen or any other desired screen
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

  //GET: Username from ID
  const getUsername = async (id: number) => {
    try {
      const response = await axios.get('http://10.0.2.2:5000/user/' + id);
      return response.data.username;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // Fetch usernames for all user IDs in stationRequests
  const fetchUsernames = async () => {
    if (stationRequests.length > 0) {
      const usernames = await Promise.all(
        stationRequests.map(request => getUsername(request.user_id)),
      );
      setStationUsernames(usernames);
    }

    if (driverRequests.length > 0) {
      const usernames = await Promise.all(
        driverRequests.map(request => getUsername(request.user_id)),
      );
      setDriverUsernames(usernames);
    }
  };
  //GET: Robot Station ID from Address
  const getStationID = async (address: string) => {
    try {
      const response = await axios.get(
        'http://10.0.2.2:5000/robotstation/' + address,
      );
      setStationID(response.data.station_id);
    } catch (error) {
      console.log(error);
    }
  };

  //GET: Get all station requests where status = 0 ( user has reached the station to be picked up)
  const getStationRequests = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://10.0.2.2:5000/robot_request/station/${stationID}/status/0`,
      );
      setStationRequests(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  // Accept Request
  const acceptRequest = async (requestID: number, userID: number) => {
    const newDriverRequest = {
      user_id: userID,
      driver_id: userProfile?.user_id,
    };

    try {
      const response = await axios.post(
        'http://10.0.2.2:5000/driver_request',
        newDriverRequest,
      );

      // Update ROBOT request status to 4 (Finished)
      const updatedRequest = {
        request_status: 4,
      };

      const response2 = await axios.put(
        `http://10.0.2.2:5000/robot_request/${requestID}`,
        updatedRequest,
      );

      //Remove from state and refresh page
      setStationRequests(prevRequests =>
        prevRequests.filter(request => request.request_id !== requestID),
      );
      setRefreshPage(true);
    } catch (error) {
      console.log(error);
    }
  };

  //GET: Get all driver requests not completed
  const getDriverRequests = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://10.0.2.2:5000/driver_request/driver/${userProfile?.user_id}`,
      );
      setDriverRequests(response.data);
      setIsLoading(false);
      console.log(response.data);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
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

  //Complete Request
  const completeTrip = async (requestID: number) => {
    try {
      const currentRequest = driverRequests.find(
        request => request.request_id === requestID,
      );

      if (currentRequest) {
        let newStatus;

        if (currentRequest.request_status === 2) {
          newStatus = 3;
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

          //remove from state and refresh page
          setDriverRequests(prevRequests =>
            prevRequests.filter(request => request.request_id !== requestID),
          );

          setRefreshPage(true);
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
        return 'Picked Up User';
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

  useEffect(() => {
    if (refreshPage) {
      // Reset the state variable to prevent infinite refresh loop
      setRefreshPage(false);

      getStationRequests();
      getDriverRequests();
    }
  }, [refreshPage]);

  useEffect(() => {
    fetchUsernames();
  }, [stationRequests]);

  useEffect(() => {
    fetchUsernames();
  }, [driverRequests]);

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
        {/* Main Content */}
        <View style={bodyContainer.container}>
          {/* Header */}
          <View style={{ ...styles.buttonContainer, marginBottom: 20 }}>
            <View>
              <Text style={{ ...styles.buttonText, textAlign: 'left' }}>
                Driver Name: {userProfile?.username}
              </Text>
              <Text style={{ ...styles.buttonText, textAlign: 'left' }}>
                Driver Station: {userProfile?.address}
              </Text>
            </View>
          </View>

          {/* Driver Requests */}
          <ScrollView>
            <View
              style={{
                ...styles.cardContainer,
                backgroundColor: theme.colors.surface,
              }}
            >
              <View style={styles.headingRow}>
                <View style={styles.headingTextContainer}>
                  <Text
                    style={{
                      ...styles.cardHeading,
                      color: theme.colors.secondary,
                    }}
                  >
                    Ongoing Requests
                  </Text>
                </View>
              </View>

              {isLoading ? (
                <ActivityIndicator
                  style={{ marginTop: 20 }}
                  size="large"
                  color={theme.colors.primary}
                />
              ) : (
                <>
                  {driverRequests.length > 0 ? (
                    driverRequests.map((driverrequest, index) => (
                      <View
                        key={driverrequest.request_id}
                        style={styles.requestContainer}
                      >
                        <Text style={styles.requestStatus}>
                          Request ID: {driverrequest.request_id}
                        </Text>
                        <Text style={styles.requestStatus}>
                          User: {driverUsernames[index]}
                        </Text>
                        <Text style={styles.requestStatus}>
                          Status: {getStatusWord(driverrequest.request_status)}
                        </Text>
                        {driverrequest.request_status !== 2 && (
                          <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={() =>
                              updateRequestStatus(driverrequest.request_id)
                            }
                          >
                            <Text style={styles.buttonText}>Update Status</Text>
                          </TouchableOpacity>
                        )}

                        {driverrequest.request_status === 2 && (
                          <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={() =>
                              completeTrip(driverrequest.request_id)
                            }
                          >
                            <Text style={styles.buttonText}>Complete Trip</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    ))
                  ) : (
                    <Text style={styles.errorText}>No requests found</Text>
                  )}
                </>
              )}
            </View>

            {/* Station Requests */}

            <View
              style={{
                ...styles.cardContainer,
                backgroundColor: theme.colors.surface,
              }}
            >
              <View style={styles.headingRow}>
                <View style={styles.headingTextContainer}>
                  <Text
                    style={{
                      ...styles.cardHeading,
                      color: theme.colors.secondary,
                    }}
                  >
                    Incomming Requests
                  </Text>
                </View>
              </View>

              {isLoading ? (
                <ActivityIndicator
                  style={{ marginTop: 20 }}
                  size="large"
                  color={theme.colors.primary}
                />
              ) : (
                <>
                  {stationRequests.length > 0 ? (
                    stationRequests.map((request, index) => (
                      <View key={request.id} style={styles.requestContainer}>
                        <Text style={styles.requestStatus}>
                          User: {stationUsernames[index]}
                        </Text>
                        <Text style={styles.requestStatus}>
                          Ready be picked Up
                        </Text>

                        <TouchableOpacity
                          style={styles.buttonContainer}
                          onPress={() =>
                            acceptRequest(request.request_id, request.user_id)
                          }
                        >
                          <Text style={styles.buttonText}>Accept</Text>
                        </TouchableOpacity>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.errorText}>No requests found</Text>
                  )}
                </>
              )}
            </View>
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
  cardContainer: {
    borderRadius: 15,
    backgroundColor: colors.white,
    elevation: 5,
    padding: 10,
    marginBottom: 20,
  },
  requestContainer: {
    marginVertical: 10,
  },
  requestStatus: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 18,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  headingTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  cardHeading: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'red',
  },
});

export default DriverDashboardScreen;
