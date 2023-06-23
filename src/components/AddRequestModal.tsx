import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Button,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../styles/styles';
import axios from 'axios';

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

const AddRequestModal: React.FC<AddRequestModalProps> = ({
  visible,
  onClose,
  onSave,
  stations,
  selectedStation,
}) => {
  const [selectedDestinationId, setSelectedDestinationId] = useState<number>();
  const handleSave = async () => {
    if (selectedDestinationId) {
      const selectedDestination = stations.find(station => station.station_id === selectedDestinationId);
      if (selectedDestination) {
        try {
          // Call the new endpoint to get the list of robots at the station
          const robotResponse = await axios.get(`http://10.0.2.2:5000/robot/station/${selectedStation.station_id}/status/1`);
          const robots = robotResponse.data;
  
          // Check if any robots are available
          if (!robots || robots.length === 0) {
            Alert.alert('No robots available at the station');
            return;
          }
  
          // Use the robot_id of the first robot in the list
          const robotId = robots[0].robot_id;
  
          // Post the robot request
          const response = await axios.post(
            'http://10.0.2.2:5000/robot_request', 
            {
              user_id: 7, 
              robot_id: robotId, 
              request_status: 1,
              pickup_station: selectedStation.station_id,
              destination_station: selectedDestination.station_id,
            },
          );
      
          if (response.status === 200) {
            onSave(selectedDestination);
            Alert.alert('Robot request successfully sent');
          } else {
            Alert.alert('Failed to send the robot request');
          }
        } catch (error) {
          console.error(error);
          Alert.alert('An error occurred while sending the robot request');
        }
      }
    }
  };
  

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <Text>Select Destination</Text>
      <Picker
        selectedValue={selectedDestinationId}
        onValueChange={(itemValue) =>
          setSelectedDestinationId(itemValue as number)
        }
      >
        {stations.map((station) => (
          <Picker.Item
            label={station.station_name}
            value={station.station_id}
            key={station.station_id}
          />
        ))}
      </Picker>
      <Button title="Save" onPress={handleSave} />
      <Button title="Cancel" onPress={onClose} />
    </Modal>
  );
};

export default AddRequestModal;
