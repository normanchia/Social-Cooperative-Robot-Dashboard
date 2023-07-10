import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Button,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DatePicker from 'react-native-date-picker';

interface Station {
  station_id: number;
  station_name: string;
  station_location: string;
  slot_available: number;
  total_slot: number;
}

interface AddRequestModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (destination: Station) => void;
  stations: Station[];
  selectedStation: Station;
}

// get window's width and height
const { width, height } = Dimensions.get("window");

const AddRequestModal: React.FC<AddRequestModalProps> = ({
  visible,
  onClose,
  onSave,
  stations,
  selectedStation,
}) => {
  const theme = useTheme();
  const [userID, setUserID] = useState<string>();
  const [selectedDestinationId, setSelectedDestinationId] = useState<number>(
    stations[0].station_id
  );

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const getUserId = async () => {
      const userId = await AsyncStorage.getItem("userProfileID");
      if (userId) {
        setUserID(userId);
      }
    };

    getUserId();
  }, []);

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleSave = async () => {
    if (selectedDestinationId) {
      const selectedDestination = stations.find(
        (station) => station.station_id === selectedDestinationId
      );
      if (selectedDestination) {
        try {
          // Call the new endpoint to get the list of robots at the station
          const robotResponse = await axios.get(
            `https://itp3111.as.r.appspot.com/robot/station/${selectedStation.station_id}/status/1`
          );
          const robots = robotResponse.data;

          // Check if any robots are available
          if (!robots || robots.length === 0) {
            Alert.alert("No robots available at the station");
            return;
          }

          // Use the robot_id of the first robot in the list
          const robotId = robots[0].robot_id;
          console.log(date.getTime())
          // Post the robot request
          const response = await axios.post(
            "https://itp3111.as.r.appspot.com/robot_request",
            {
              user_id: userID,
              robot_id: robotId,
              request_status: 1,
              pickup_station: selectedStation.station_id,
              destination_station: selectedDestination.station_id,
              request_time: date.getTime(),
            }
          );

          if (response.status === 200) {
            onSave(selectedDestination);
            Alert.alert("Robot request successfully sent");
            onClose();
          } else {
            Alert.alert("Failed to send the robot request");
          }
        } catch (error) {
          console.error(error);
          Alert.alert("An error occurred while sending the robot request");
        }
      }
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent
    >
      <View style={styles.centeredView}>
        <View style={{ ...styles.modalView, backgroundColor: theme.colors.background }}>
          <Text style={{ color: theme.colors.secondary }}>
            Select Destination
          </Text>
          <View style={{ backgroundColor: theme.colors.background }}>
            <Picker
              selectedValue={selectedDestinationId}
              onValueChange={(itemValue) =>
                setSelectedDestinationId(itemValue as number)
              }
              dropdownIconColor={theme.colors.secondary}
              style={{ backgroundColor: theme.colors.background }} 
            >
              {stations.map((station) => (
                <Picker.Item
                  label={station.station_name}
                  value={station.station_id}
                  key={station.station_id.toString()}
                  color={theme.colors.secondary}
                  style={{ backgroundColor: theme.colors.background}}
                />
              ))}
            </Picker>
          </View>
          <View style={styles.buttonContainer}>
          <Text style={{ color: theme.colors.secondary }}>Select Time</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={{ color: theme.colors.secondary }}>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <View>
              <DatePicker
                date={date}
                onDateChange={setDate}
                mode="time"
                minimumDate={new Date(Date.now())} // Set minimum date to now
                maximumDate={new Date(Date.now() + 24*60*60*1000)} // Set maximum date to 24 hours from now    
                style={{ backgroundColor: theme.colors.background, width: 200 }}
                textColor={theme.colors.secondary}
              />
              <TouchableOpacity
              style={{ ...styles.button, backgroundColor: theme.colors.background }}
              onPress={() => setShowDatePicker(false)}>    
              <Text style={{ ...styles.buttonText, color: theme.colors.secondary }}>
                Confirm Time
              </Text>    
              </TouchableOpacity>
            </View>
          )}
            <TouchableOpacity
              style={{ ...styles.button, backgroundColor: theme.colors.background }}
              onPress={handleSave}
            >
              <Text style={{ ...styles.buttonText, color: theme.colors.secondary }}>
                Save
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.button, backgroundColor: theme.colors.background }}
              onPress={onClose}
            >
              <Text style={{ ...styles.buttonText, color: theme.colors.secondary }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.8,
  },
  buttonContainer: {
    bottom: 0,
    width: "100%",
    padding: 20,
  },
  button: {
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
    width: "100%",
  },
  buttonText: {},
});

export default AddRequestModal;
