import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from "react-native";
import { mainContainer, bodyContainer, colors } from "../styles/styles";
import Header from "../components/Header";
import LocationCardRow from "../components/LocationCardRow";
import RequestCardRow from "../components/RequestCardRow";
import { useTheme } from "react-native-paper";
import axios from "axios";
import AddRequestModal from "../components/AddRequestModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Robot_Request {
  user_id: number;
  request_status: number;
  request_id: number;
  pickup_station_name: string;
  destination_station_name: string;
  robot_id: number;
  pickup_station_id: number;
  destination_station_id: number;
  request_time: Date; 
}

interface Station {
  station_id: number;
  station_name: string;
  station_location: string;
  slot_available: number;
  total_slot: number;
}

const CallScreen: React.FC = () => {
  // States
  const theme = useTheme(); // use the theme hook
  const [userID, setUserID] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [addRequestModal, toggleRequestModal] = useState(false);
  const [stations, setStations] = useState<Station[]>([]);
  const [robot_requests, setRequests] = useState<Robot_Request[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [fetchAllData, setFetchAllData] = useState<(() => Promise<void>) | null>(null);

  // Get: All Station
  const fetchStations = async () => {
    const response = await axios.get(`https://itp3111.as.r.appspot.com/appspot.com/robotstations`);
    if (response.status === 200) {
      setStations(response.data);
    }
  };

  // Get: Existing Request
  const fetchRequests = async (userId: number) => {
    const response = await axios.get(
      `https://itp3111.as.r.appspot.com/appspot.com/robot_request/user/${userId}/status_notIn/0,4`,
    );
    if (response.status === 200) {
      setRequests(response.data);
    }
  };

  const completeHandler = useCallback(async (request: Robot_Request) => {
    console.log("completeHandler called with request:", request);
    try {
      setIsLoading(true);
      const response = await axios.put(
        `https://itp3111.as.r.appspot.com/appspot.com/robot_request/${request.request_id}`,
        {
          request_status: 0, //close the robot request
        }
      );
      if (response.status === 200) {
        console.log("Journey completed.");
        // Remove the completed request from the state
        setRequests((prevRobotRequests) =>
          prevRobotRequests.filter(
            (req) => req.request_id !== request.request_id
          )
        );

        // Call the robot/station API endpoint
        const updateRobotStationResponse = await axios.put(
          `https://itp3111.as.r.appspot.com/appspot.com/robot/${request.robot_id}/station/${request.destination_station_id}`
        ); //update the robot parked location in sql
        if (updateRobotStationResponse.status === 200) {
          console.log("Robot and station updated successfully.");
        } else {
          console.log("Failed to update robot and station.");
        }

        // Call the update_slots API endpoint
        const updateSlotsResponse = await axios.put(
          `https://itp3111.as.r.appspot.com/appspot.com/update_slots`
        );
        if (updateSlotsResponse.status === 200) {
          console.log("Slots updated successfully.");
        } else {
          console.log("Failed to update slots.");
        }

        // If fetchAllData is defined, call it to fetch all data again
        if (fetchAllData) {
          await fetchAllData();
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAllData]); // Add fetchAllData to the dependency array of useCallback

  useEffect(() => {
    AsyncStorage.getItem("userProfileID").then((ID) => {
      if (ID != null) {
        setUserID(ID);

        const fetchAllDataFunc = async () => {
          setIsLoading(true);
          try {
            await Promise.all([fetchStations(), fetchRequests(parseInt(ID))]);
          } catch (error) {
            console.log(error);
          } finally {
            setIsLoading(false);
          }
        };
        setFetchAllData(() => fetchAllDataFunc);
        
        fetchAllDataFunc();
      }
    });
  }, []);

  const toggleModal = () => {
    toggleRequestModal(!addRequestModal);
    if (addRequestModal) {
      setSelectedStation(null);
    }
  };

  const callRobotHandler = (station: Station) => {
    setSelectedStation(station);
    toggleModal();
  };

  const createRobotRequest = async (destination: Station) => {
    if (!selectedStation) return;
    if (fetchAllData) {
      await fetchAllData();
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
        {/* Header */}
        <Header headerText={"Request Robot"} />
        {/* Main Content */}
        <ScrollView style={bodyContainer.container}>
          {addRequestModal && (
            <AddRequestModal
              visible={addRequestModal}
              stations={stations}
              selectedStation={selectedStation!}
              onSave={createRobotRequest}
              onClose={toggleModal}
            />
          )}
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
  },
  headingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  headingTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  cardHeading: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    textDecorationLine: "underline",
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
    position: "absolute",
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
    fontWeight: "bold",
  },
});

export default CallScreen;
