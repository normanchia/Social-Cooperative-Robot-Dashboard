import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { showToast } from '../util/action';
import { mainContainer, bodyContainer, colors } from '../styles/styles';
import Header from '../components/Header';
import LocationCardRow from '../components/LocationCardRow';
import RequestCardRow from '../components/RequestCardRow';
import { useTheme } from 'react-native-paper';
import axios from 'axios';

interface Robot_Request {
  user_id: number;
  request_status: number;
  request_id: number;
  pickup_station_name: string;
  destination_station_name: string;
  robot_id: number;
  pickup_station_id: number;
  destination_station_id: number;
}

interface Station {
  station_id: number;
  station_name: string;
  station_location: string;
  slot_available: number;
  total_slot: number;
}

interface Location {
  id: number;
  name: string;
}


const CallScreen: React.FC = () => {
  // States
  const [showEditModal, setShowEditModal] = useState(false);
  const theme = useTheme(); // use the theme hook
  const [isLoading, setIsLoading] = useState(false);

  const [stations, setStations] = useState<Station[]>([]);
  const [robot_requests, setRequests] = useState<Robot_Request[]>([]);

  // Get: All Station
  const fetchStations = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://10.0.2.2:5000/robotstations`,
      );
      if (response.status === 200) {
        setStations(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get: Existing Request
  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://10.0.2.2:5000/robot_request/user/7/status_not/0`,
      );
      if (response.status === 200) {
        setRequests(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers
  const callRobotHandler = () => {
    showToast('Calling Robot');
  };

  // Update your handler to accept a Robot_Request
const completeHandler = async (request: Robot_Request) => {
  console.log("completeHandler called with request:", request); 
  try {
    setIsLoading(true);
    const response = await axios.put(
      `http://10.0.2.2:5000/robot_request/${request.request_id}`,
      { 
        request_status: 0
      }
    );
    if (response.status === 200) {
      showToast('Journey completed.');

      // Remove the completed request from the state
      setRequests(prevRobotRequests => 
        prevRobotRequests.filter(req => req.request_id !== request.request_id)
      );

      // Call the robot/station API endpoint
      const updateRobotStationResponse = await axios.put(
        `http://10.0.2.2:5000/robot/${request.robot_id}/station/${request.destination_station_id}`
      );
      if(updateRobotStationResponse.status === 200){
        showToast('Robot and station updated successfully.');
        // You can update your state related to robot or station here, if necessary
        fetchStations();
      } else {
        showToast('Failed to update robot and station.');
      }

      // Call the update_slots API endpoint
      const updateSlotsResponse = await axios.put(`http://10.0.2.2:5000/update_slots`);
      if(updateSlotsResponse.status === 200){
        showToast('Slots updated successfully.');
        // You can update your state related to slots here, if necessary
      } else {
        showToast('Failed to update slots.');
      }

    }
  } catch (error) {
    console.log(error);
  } finally {
    setIsLoading(false);
  }
}

  useEffect(() => {
    fetchStations();
    fetchRequests();
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
        <Header headerText={'Request Robot'} />
        {/* Main Content */}
        <View style={bodyContainer.container}>
        
          {/* Existing Booking */}
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
                  Current Request
                </Text>
              </View>
            </View>
            <View style={styles.border} />
            <RequestCardRow
              robot_request={robot_requests}
              completeHandler={completeHandler}
            />
          </View>
          {/* Nearby */}
          <View
            style={{
              ...styles.cardContainer,
              backgroundColor: theme.colors.surface,
            }}
          >
            <Text
              style={{ ...styles.cardHeading, color: theme.colors.secondary }}
            >
              Nearby Station
            </Text>
            <View style={styles.border} />
            <LocationCardRow
              location={stations}
              callRobotHandler={callRobotHandler}
            />
          </View>
        </View>
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
  border: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    paddingBottom: 10,
  },
  searchBar: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray,
    paddingLeft: 10,
    marginBottom: 10,
  },
  dropdownContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: colors.white,
    borderRadius: 10,
    elevation: 5,
    paddingHorizontal: 10,
  },
  dropdownItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CallScreen;
