import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from 'react-native-paper';
import { colors } from '../styles/styles';

interface Station {
  station_id: number;
  station_name: string;
  station_location: string;
}

interface LocationCardRowProps {
  location: Station[];
  callRobotHandler: () => void;
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
              {item.station_location}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              style={[
                styles.cardBtn,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={callRobotHandler}
            >
              <Text style={styles.cardBtnText}>Go Again</Text>
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
