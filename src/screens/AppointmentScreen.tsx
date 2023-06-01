import React, { useState } from 'react';
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

const testToast = () => {
  showToast('This is a test toast 🍞');
};

const AppointmentScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<Record<string, null>>>();
  const navigateToAddAppt = () => {
    navigation.navigate('AddAppointmentScreen', null);
  };

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
          dateTime: 'Tuesday, 31 May 2023 @ 09:00',
          notes: '',
          title: 'Routine Checkup',
        },
        {
          location: 'Tan Tock Seng Hospital, Wing 3',
          dateTime: 'Tuesday, 2 June 2023 @ 10:00',
          notes: '',
          title: 'Reflexologist Specialist',
        },
        {
          location: 'Tan Tock Seng Hospital, Wing B4',
          dateTime: 'Tuesday, 6 June 2023 @ 09:00',
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
            dateTime: 'Tuesday, 30 May 2023 @ 15:00',
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
  return (
    <>
      <SafeAreaView style={mainContainer.container}>
        {/* Header */}
        <Header headerText={'Appointments'} />
        <TouchableOpacity onPress={navigateToAddAppt}>
          <Text
            style={{
              color: colors.white,
              borderRadius: 5,
              position: 'absolute',
              bottom: 10,
              right: 10,
              backgroundColor: colors.primary,
              paddingHorizontal: 10,
              paddingVertical: 10,
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            {/* <Image
              style={{
                width: 10,
                height: 10,
                padding: 10,
                borderColor: '#998',
                borderWidth: 5,
              }}
              source={{
                uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
              }}
            /> */}
            +{'\u00A0'} Add new Appt
          </Text>
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

        {/* FAB to add new appointments */}
        {/* <View style={styles.FABcontainer}>
          <FAB onPress={testToast} title="Add Appt" position="bottom-right" />
        </View> */}
      </SafeAreaView>

      {/* Bottom Nav */}
      <BottomNav activeRoute={'AppointmentScreen'} />
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 15,
    backgroundColor: colors.white,
    elevation: 5,
    padding: 5,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  cardContainerPast: { backgroundColor: '#F7F7F8' },
  cardContainerUpcoming: {
    borderLeftColor: 'mediumseagreen',
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
  FABcontainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  addIcon: {
    width: 10,
    height: 10,
    paddingRight: 5,
  },
  apptSectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'rgba(245,245,245,1.0)',
  },
  apptItem: {
    padding: 10,
    fontSize: 16,
    height: 'auto',
  },
  apptNote: {
    padding: 10,
    fontSize: 15,
    height: 'auto',
    fontWeight: 'bold',
    color: '#DF3079',
  },
  apptItemDateTime: {
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 20,
    height: 'auto',
    color: colors.black,
  },
});

export default AppointmentScreen;
