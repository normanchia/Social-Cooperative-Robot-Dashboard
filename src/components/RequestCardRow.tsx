import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from 'react-native-paper';
import { colors } from '../styles/styles';

interface Robot_Request {
    user_id: number;
    request_status: number;
    request_id: number;
    pickup_station_name: string;
    destination_station_name: string;
    pickup_station_id: number;
    destination_station_id: number;
    robot_id: number;
    request_time: Date;
  }

interface RequestCardRowProps {
  robot_request: Robot_Request[];
  completeHandler: (request: Robot_Request) => void;
}

const statusMapping: { [key: number]: string } = {
  0: 'Completed',
  1: 'Ready for pickup',
  2: 'In transit',
  3: 'On the way',

}

const RequestCardRow: React.FC<RequestCardRowProps> = ({
    robot_request,
    completeHandler,
}) => {
  const theme = useTheme(); // use the theme hook

  
  return (
    <>
      {robot_request && robot_request.map(item => (
        <View key={item.request_id} style={styles.cardRow}>
          <Icon
            size={30}
            name="location-on"
            style={[styles.cardIcon, { backgroundColor: theme.colors.primary }]}
            color={colors.white}
          />
          <View style={styles.cardInfo}>
            <Text style={[styles.cardText, { color: theme.colors.secondary }]}>
              {statusMapping[item.request_status]}
            </Text>
            <Text style={{ color: theme.colors.secondary }}>
              {item.pickup_station_name} - {item.destination_station_name} 
            </Text>
            <Text style={{ color: theme.colors.secondary }}>
              Pick Up Time: {new Date(item.request_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
            </Text>
          </View>
          <View>
            <TouchableOpacity
              style={[
                styles.cardBtn,
                { backgroundColor: theme.colors.complete },
              ]}
              onPress={() => {
                completeHandler(item);
              }}              >
              <Text style={styles.cardBtnText}>Complete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
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
    flex: 1,
    paddingHorizontal: 10,
  },
  cardText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardIcon: {
    borderRadius: 30,
    padding: 10,
  },
  cardBtn: {
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  cardBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RequestCardRow;
