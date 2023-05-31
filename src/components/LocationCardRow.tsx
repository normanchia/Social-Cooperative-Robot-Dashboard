import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../styles/styles';

interface Location {
  id: number;
  name: string;
  distance: string;
}

interface LocationCardRowProps {
  location: Location[];
  callRobotHandler: () => void;
}

const LocationCardRow: React.FC<LocationCardRowProps> = ({
  location,
  callRobotHandler,
}) => (
  <>
    {location.map(item => (
      <View key={item.id} style={styles.cardRow}>
        <Icon
          size={30}
          name="location-on"
          style={styles.cardIcon}
          color={colors.white}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.cardText}>{item.name}</Text>
          <Text>{item.distance}</Text>
        </View>
        <View>
          <TouchableOpacity style={styles.cardBtn} onPress={callRobotHandler}>
            <Text style={styles.cardBtnText}>Go Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    ))}
  </>
);

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
    backgroundColor: colors.primary,
    borderRadius: 30,
    padding: 10,
  },
  cardBtn: {
    backgroundColor: colors.primary,
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
