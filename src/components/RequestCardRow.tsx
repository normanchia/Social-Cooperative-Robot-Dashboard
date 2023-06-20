import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from 'react-native-paper';
import { colors } from '../styles/styles';

interface Robot_Request {
    user_id: number;
    request_status: number;
    request_id: number;
    pickup_station: string;
    destination_station: string;
    robot_id: number;
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
              {item.pickup_station} - {item.destination_station} 
            </Text>

          </View>
          <View>
            <TouchableOpacity
              style={[
                styles.cardBtn,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => {
                console.log("Calling completeHandler with item.request_id:", item.request_id); // Add this line
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
