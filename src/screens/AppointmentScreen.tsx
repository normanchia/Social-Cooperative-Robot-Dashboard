// TODO Fix green border with the appointments

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  SectionList,
  RefreshControl,
} from 'react-native';

import { mainContainer, bodyContainer, colors } from '../styles/styles';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { ScrollView } from 'react-native-gesture-handler';
import FAB from '../../FAB';
import { showToast } from '../util/action';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

const testToast = () => {
  showToast('This is a test toast 🍞');
};

const AppointmentScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<Record<string, null>>>();
  const navigateToAddAppt = () => {
    navigation.navigate('AddAppointmentScreen', null);
  };

  // Theme
  const theme = useTheme();

  // For refreshing and updating past appointments
  const wait = (timeout: number) => {
    return new Promise<void>(resolve => setTimeout(resolve, timeout));
  };
  const [refreshing, setRefreshing] = useState(false);
  const [sectionsUpcomingAppt, setSections] = useState([
    {
      title: 'Upcoming Appointments',
      data: [
        {
          location: 'Tan Tock Seng Hospital, Wing B4',
          dateTime: 'Tuesday, 31 May 2023 \n09:00',
          notes: '',
          title: 'Routine Checkup',
        },
        {
          location: 'Tan Tock Seng Hospital, Wing 3',
          dateTime: 'Tuesday, 2 June 2023 \n10:00',
          notes: '',
          title: 'Reflexologist Specialist',
        },
        {
          location: 'Tan Tock Seng Hospital, Wing B4',
          dateTime: 'Tuesday, 6 June 2023 \n09:00',
          notes: 'Please bring along your NRIC',
          title: 'Routine Checkup',
        },
      ],
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    wait(1000).then(() => {
      // Pull data from database here, this is just dummy data
      const sectionsPastAppt = {
        title: 'Past Appointments',
        data: [
          {
            location: 'Tan Tock Seng Hospital, Wing 1',
            dateTime: 'Tuesday, 30 May 2023 \n15:00',
            notes: '',
            title: 'Radiology',
          },
        ],
      };

      // Set section code to add past appointments to the list, but only 1 copy even if the user refresh multiple times
      setSections(prevSection => {
        // Check if 'Past Appointments' section already exists
        const pastAppointmentsIndex = prevSection.findIndex(
          section => section.title === 'Past Appointments',
        );

        if (pastAppointmentsIndex !== -1) {
          // Past Appointments section already exists, replace it
          prevSection[pastAppointmentsIndex] = sectionsPastAppt;
        } else {
          // Past Appointment section doesn't exist, add to start of list
          prevSection.unshift(sectionsPastAppt);
        }

        return [...prevSection];
      });

      setRefreshing(false);
    });
  };

  const styles = StyleSheet.create({
    mainContainerBackgroundColor: {
      backgroundColor: theme.colors.background,
    },
    cardContainer: {
      borderRadius: 15,
      backgroundColor: theme.colors.background,
      elevation: 10,
      padding: 5,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 5,
      marginBottom: 5,
    },
    cardContainerPast: {
      backgroundColor: theme.dark
        ? theme.colors.onBackground
        : theme.colors.background,
    },
    cardContainerUpcoming: {
      // borderLeftColor: 'mediumseagreen',
      borderLeftColor: theme.colors.primary,
      borderLeftWidth: 4,
      borderRadius: 4.5,
      left: -5,
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
    cardBtn: {
      backgroundColor: theme.colors.primary,
      borderRadius: 10,
      padding: 10,
      alignItems: 'center',
    },
    cardBtnText: {
      color: theme.colors.secondary,
      fontSize: 20,
      fontWeight: 'bold',
    },
    apptSectionHeader: {
      paddingTop: 2,
      paddingLeft: 10,
      paddingRight: 10,
      paddingBottom: 2,
      fontSize: 20,
      fontWeight: 'bold',
      backgroundColor: theme.dark
        ? theme.colors.surface
        : 'rgba(245, 245, 245, 1.0)',
      color: theme.colors.secondary,
    },
    apptItem: {
      color: theme.colors.secondary,
      padding: 10,
      fontSize: 18,
      height: 'auto',
    },
    apptNote: {
      padding: 10,
      fontSize: 18,
      height: 'auto',
      fontWeight: 'bold',
      color: '#DF3079',
    },
    apptItemDateTime: {
      padding: 10,
      paddingTop: 5,
      paddingBottom: 5,
      fontSize: 28,
      height: 'auto',
      color: theme.colors.secondary,
    },
    addNewApptBtn: {
      color: colors.white,
      borderRadius: 5,
      position: 'absolute',
      bottom: 10,
      right: 10,
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 10,
      paddingVertical: 10,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  return (
    <>
      <SafeAreaView
        style={[mainContainer.container, styles.mainContainerBackgroundColor]}
      >
        {/* Header */}
        <Header headerText={'Appointments'} />
        <TouchableOpacity onPress={navigateToAddAppt}>
          <Text style={[styles.addNewApptBtn]}>+{'\u00A0'} Add new Appt</Text>
        </TouchableOpacity>

        {/* Main Content */}
        <SectionList
          sections={sectionsUpcomingAppt}
          renderItem={({ item, section }) => (
            // Render each item
            <View
              style={
                section.title === 'Upcoming Appointments'
                  ? [styles.cardContainer]
                  : [styles.cardContainer, styles.cardContainerPast]
              }
            >
              <View
                style={
                  section.title === 'Upcoming Appointments'
                    ? styles.cardContainerUpcoming
                    : styles.cardContainerPast
                }
              >
                <Text style={styles.apptItemDateTime}>{item.dateTime}</Text>
                <Text style={styles.apptItem}>
                  {item.title} @{item.location}
                </Text>

                <Text
                  style={
                    item.notes === '' ? { display: 'none' } : styles.apptNote
                  }
                >
                  {item.notes}
                </Text>
              </View>
            </View>
          )}
          renderSectionHeader={({ section }) => (
            <Text style={styles.apptSectionHeader}>{section.title}</Text>
          )}
          keyExtractor={item => `basicListEntry-${item.dateTime}`}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </SafeAreaView>
    </>
  );
};

export default AppointmentScreen;
