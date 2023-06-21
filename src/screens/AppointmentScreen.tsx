import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  SectionList,
  RefreshControl,
  SectionListData,
} from 'react-native';

import { mainContainer, colors } from '../styles/styles';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { ScrollView } from 'react-native-gesture-handler';
import { showToast } from '../util/action';
import {
  useNavigation,
  NavigationProp,
  useRoute,
  ParamListBase,
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import axios from 'axios';
import { format, isAfter, isBefore, isSameDay, parse } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApptDialog from '../components/ApptDialog';

const testToast = () => {
  showToast('This is a test toast 🍞');
};

interface Appointment {
  appointment_id: number;
  hospital_id: number;
  hospital_name: string;
  appointment_time: number;
  appointment_date: string;
  additional_note: string;
  appointment_title: string;
}

const AppointmentScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const navigateToAddAppt = () => {
    navigation.navigate('AddAppointmentScreen', {
      screenIntent: 'addAppointment',
    });
  };
  // Theme
  const theme = useTheme();
  // For getting past and upcoming appointments from backend
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    Appointment[]
  >([]);

  const fetchHospitalNames = async (hospitalId: number) => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:5000/hospital/${hospitalId}`,
      );
      if (response.status === 200) {
        const { hospital_name } = response.data;
        return hospital_name;
      }
    } catch (error) {
      console.error('ApptScreen fetchHospitalNames:', error);
    }
  };

  const fetchAppointments = async (userId: number) => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:5000/appointment/user/${userId}`,
      );
      if (response.status === 200) {
        const today = new Date();
        const allAppointments = response.data;

        // Filter appointments before today
        const appointmentsBeforeToday = allAppointments.filter(
          (appointment: Appointment) => {
            const appointmentDate = parse(
              appointment.appointment_date,
              "EEE, dd MMM yyyy HH:mm:ss 'GMT'",
              new Date(),
            );
            return isBefore(appointmentDate, today);
          },
        );

        // Filter appointments after today
        const appointmentsAfterToday = allAppointments.filter(
          (appointment: Appointment) => {
            const appointmentDate = parse(
              appointment.appointment_date,
              "EEE, dd MMM yyyy HH:mm:ss 'GMT'",
              new Date(),
            );
            return isAfter(appointmentDate, today);
          },
        );
        setPastAppointments(appointmentsBeforeToday);
        setUpcomingAppointments(appointmentsAfterToday);
      }
    } catch (error) {
      console.log('AppointmentScreen:', error);
    }
  };

  useEffect(() => {
    // Get appointments for the user
    AsyncStorage.getItem('userProfileID').then(ID => {
      if (ID != null) {
        // console.debug(' ===== Parsed userID', ID, 'to appt page =====');
        // fetchAppointments(parseInt(ID));
        // setLoading(false);
        setUserID(ID); // To use outside this function
      }
    });
  }, []);

  // Refresh sectionList
  const isFocused = useIsFocused();
  const [userID, setUserID] = useState<string>();
  useEffect(() => {
    setLoading(true); // Add loading circle initially
    if (isFocused || userID) {
      // console.log('refreshing sectionlist...');
      userID ? fetchAppointments(parseInt(userID)) : null;
      // : console.error('UserID is null');
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [isFocused, userID]);

  //          ===== SECTION LIST =====
  // For refreshing and updating past appointments
  const wait = (timeout: number) => {
    return new Promise<void>(resolve => setTimeout(resolve, timeout));
  };
  const [refreshing, setRefreshing] = useState(false); // SectionList refresh to get past appt
  const [loading, setLoading] = useState(true); // loading indicator when first visit page
  const [sectionsUpcomingAppointment, setSectionsUpcomingAppt] = useState<
    SectionListData<any, {}>[]
  >([]);
  const [sectionsPastAppointment, setSectionsPastAppt] = useState<
    SectionListData<any, {}>[]
  >([]);

  //  === Formatting data to be useable in SectionLists ===
  const formatTime = (time: number) => {
    const ms = time * 1000;
    const tmpDate = new Date(ms);
    const formattedTime = tmpDate.toLocaleTimeString('en-US', {
      timeZone: 'UTC',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
    });
    return formattedTime;
  };

  const formatDate = (dateString: string) => {
    const fullDate = new Date(dateString);
    const formattedDate = fullDate.toLocaleDateString('en-SG', {
      timeZone: 'UTC',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const day = fullDate.toLocaleDateString('en-SG', {
      timeZone: 'UTC',
      weekday: 'long',
    });
    let regex = /[A-Za-z]+/i;
    const formattedDay = regex.exec(day);

    return `${formattedDate} (${formattedDay})`;
  };

  const formatSectionData = async () => {
    const pastAppointmentsData = {
      title: 'Past Appointments',
      data: await Promise.all(
        pastAppointments.map(async appointment => {
          const hospitalName = await fetchHospitalNames(
            appointment.hospital_id,
          );
          return {
            appointment_id: appointment.appointment_id,
            hospital_id: appointment.hospital_id,
            hospital_name: hospitalName,
            appointment_date: formatDate(appointment.appointment_date),
            appointment_time: formatTime(appointment.appointment_time),
            additional_note: appointment.additional_note,
            appointment_title: appointment.appointment_title,
          };
        }),
      ),
    };
    const upcomingAppointmentsData = {
      title: 'Upcoming Appointments',
      data: await Promise.all(
        upcomingAppointments.map(async appointment => {
          const hospitalName = await fetchHospitalNames(
            appointment.hospital_id,
          );
          return {
            appointment_id: appointment.appointment_id,
            hospital_id: appointment.hospital_id,
            hospital_name: hospitalName,
            appointment_date: formatDate(appointment.appointment_date),
            appointment_time: formatTime(appointment.appointment_time),
            additional_note: appointment.additional_note,
            appointment_title: appointment.appointment_title,
          };
        }),
      ),
    };

    setSectionsPastAppt([pastAppointmentsData]);
    setSectionsUpcomingAppt([upcomingAppointmentsData]);
  };

  useEffect(() => {
    formatSectionData();
  }, [pastAppointments, upcomingAppointments]);

  const onRefresh = () => {
    // Section List pull down to get past appointments
    setRefreshing(true);
    wait(1000).then(() => {
      // Set section code to add past appointments to the list, but only 1 copy even if the user refresh multiple times
      setSectionsUpcomingAppt(prevSection => {
        // Check if 'Past Appointments' section already exists
        const pastAppointmentsIndex = prevSection.findIndex(
          (section: SectionListData<any>) =>
            section.title === 'Past Appointments',
        );

        if (pastAppointmentsIndex !== -1) {
          // Past Appointments section already exists, replace it
          prevSection[pastAppointmentsIndex].data =
            sectionsPastAppointment[0].data;
        } else {
          // Past Appointment section doesn't exist, add to start of list
          prevSection.unshift(sectionsPastAppointment[0]);
        }

        return [...prevSection];
      });

      setRefreshing(false);
    });
  };

  // Dialog box
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const onApptCardTap = (item: Appointment) => {
    // console.log(item);
    setSelectedAppointment(item);
    setDialogVisible(true);
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

        {/* ===== MAIN CONTENT ===== */}

        {/* SectionList */}
        {loading ? (
          <ActivityIndicator
            style={{ marginTop: 20 }}
            size={'large'}
            color={theme.colors.primary}
          />
        ) : (
          <SectionList
            sections={
              sectionsUpcomingAppointment as SectionListData<Appointment>[]
            }
            renderItem={({ item, section }) => (
              // Render each item
              <TouchableOpacity
                onPress={() => onApptCardTap(item)}
                style={
                  section.title === 'Upcoming Appointments'
                    ? [styles.cardContainer]
                    : [styles.cardContainer, styles.cardContainerPast]
                }
              >
                {/* Content in each card */}
                <View>
                  <View
                    style={
                      section.title === 'Upcoming Appointments'
                        ? styles.cardContainerUpcoming
                        : styles.cardContainerPast
                    }
                  >
                    <Text style={styles.apptItemDateTime}>
                      {item.appointment_date}
                    </Text>
                    <Text style={styles.apptItemDateTime}>
                      {item.appointment_time}
                    </Text>
                    <Text style={styles.apptItem}>
                      {item.appointment_title} @{item.hospital_name}
                    </Text>

                    <Text
                      style={
                        item.additional_note === ''
                          ? { display: 'none' }
                          : styles.apptNote
                      }
                    >
                      {item.additional_note}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            renderSectionHeader={({ section }) => (
              <Text style={styles.apptSectionHeader}>{section.title}</Text>
            )}
            keyExtractor={item => `basicListEntry-${item.appointment_id}`}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}

        {/* Dialogbox */}
        {isDialogVisible ? (
          <ApptDialog
            appt={selectedAppointment}
            onClose={() => setDialogVisible(false)}
          />
        ) : (
          <></>
        )}
      </SafeAreaView>
    </>
  );
};

export default AppointmentScreen;
