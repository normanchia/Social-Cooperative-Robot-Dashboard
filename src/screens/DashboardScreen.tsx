import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

import { mainContainer, bodyContainer, colors } from '../styles/styles';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { showToast } from '../util/action';
import Icon from 'react-native-vector-icons/MaterialIcons';

//Temp Data
const todaysAppt = {
  id: 1,
  name: 'Medical @TTSH1',
  location: 'Tan Tock Seng Hospital-1',
  time: '08:00 am',
};

const upcomingAppt = [
  {
    id: 1,
    name: 'Medical @TTSH2',
    location: 'Tan Tock Seng Hospital-2',
    time: '09:00 am',
  },
  {
    id: 2,
    name: 'Medical @TTSH3',
    location: 'Tan Tock Seng Hospital-3',
    time: '10:00 am',
  },
  {
    id: 3,
    name: 'Medical @TTSH4',
    location: 'Tan Tock Seng Hospital-4',
    time: '11:00 am',
  },
];

const DashboardScreen: React.FC = () => {
  const callRobotHandler = () => {
    showToast('Calling Robot');
  };

  return (
    <>
      <SafeAreaView style={mainContainer.container}>
        {/* Header */}
        <Header headerText={'Hi Joe !'} home={true} />
        {/* Main Content */}
        <View style={bodyContainer.container}>
          {/* Today's Appointment Card */}
          <View style={styles.cardContainer}>
            <Text style={styles.cardHeading}>Today's Appoinment</Text>
            <ApptCardRow appt={[todaysAppt]} />

            <TouchableOpacity style={styles.cardBtn} onPress={callRobotHandler}>
              <Text style={styles.cardBtnText}>Call Robot</Text>
            </TouchableOpacity>
          </View>
          {/* Upcoming  Appointment Card */}
          <View style={styles.cardContainer}>
            <Text style={styles.cardHeading}>Upcoming Appoinment</Text>
            <ApptCardRow appt={upcomingAppt} />
          </View>
        </View>
      </SafeAreaView>
      {/* Bottom Nav */}
      <BottomNav activeRoute={'DashboardScreen'} />
    </>
  );
};

interface Appointment {
  id: number;
  name: string;
  location: string;
  time: string;
}

interface ApptCardRowProps {
  appt: Appointment[];
}

const ApptCardRow: React.FC<ApptCardRowProps> = ({ appt }) => (
  <>
    {appt.map(item => (
      <View key={item.id} style={styles.cardRow}>
        <Icon
          size={30}
          name="calendar-today"
          style={styles.cardIcon}
          color={colors.white}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.cardText}>{item.name}</Text>
          <Text>{item.location}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardText}> {item.time}</Text>
        </View>
      </View>
    ))}
  </>
);

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 15,
    backgroundColor: colors.white,
    elevation: 5,
    padding: 10,
    marginBottom: 20,
  },
  cardHeading: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    paddingVertical: 10,
  },
  cardInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
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
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
