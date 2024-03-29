import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from 'react-native-paper';
import { colors } from '../styles/styles';

interface Station {
  station_id: number;
  station_name: string;
  station_location: string;
  slot_available: number;
  total_slot: number;
}

interface LocationCardRowProps {
  location: Station[];
  callRobotHandler: (station: Station) => void; // callRobotHandler now expects a Station as parameter
}

const LocationCardRow: React.FC<LocationCardRowProps> = ({
  location,
  callRobotHandler,
}) => {
  const theme = useTheme(); // use the theme hook

  return (
    <>
      {location.map(item => (
        <View key={item.station_id} style={styles.cardRow}>
          <Icon
            size={30}
            name="location-on"
            style={[styles.cardIcon, { backgroundColor: theme.colors.primary }]}
            color={colors.white}
          />
          <View style={styles.cardInfo}>
            <Text style={[styles.cardText, { color: theme.colors.secondary }]}>
              {item.station_name}
            </Text>
            <Text style={{ color: theme.colors.secondary }}>
              {item.total_slot-item.slot_available}/{item.total_slot} Robots available
            </Text>
            <Text style={{ color: theme.colors.secondary }}>
              {item.station_location} away
            </Text>
          </View>
          <View>
            <TouchableOpacity
              style={[
                styles.cardBtn,
                { backgroundColor: item.total_slot-item.slot_available === 0 ? 'gray' : theme.colors.primary }, // change the color if the button is disabled
              ]}
              onPress={() => callRobotHandler(item)} 
              disabled={item.total_slot-item.slot_available === 0} // disable the button if slot_available is 0
                    >
              <Text style={styles.cardBtnText}>Call Robot</Text>
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

export default LocationCardRow;
