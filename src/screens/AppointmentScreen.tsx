import React, { useEffect, useRef, useState } from 'react';
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
import {
  useNavigation,
  NavigationProp,
  ParamListBase,
  useIsFocused,
} from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import axios from 'axios';
import {
  differenceInMinutes,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isTomorrow,
  parse,
  set,
} from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApptDialog from '../components/ApptDialog';
import LoadingIndicator from '../components/LoadingIndicator';

interface IAppointment {
  appointment_id: number;
  hospital_id: number;
  hospital_name: string;
  appointment_time: number;
  appointment_date: string;
  additional_note: string;
  appointment_title: string;
}

const AppointmentScreen: React.FC = () => {
  const localTimeNow = new Date(); // Local time

  // Navigation
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const navigateToAddAppt = () => {
    navigation.navigate('AddAppointmentScreen', {
      screenIntent: 'addAppointment',
    });
  };
  // Theme
  const theme = useTheme();
  // For getting past and upcoming appointments from backend
  const [pastAppointments, setPastAppointments] = useState<IAppointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    IAppointment[]
  >([]);

  const fetchHospitalNames = async (hospitalId: number) => {
    try {
      const response = await axios.get(
        `https://itp3111.as.r.appspot.com/hospital/${hospitalId}`,
      );
      if (response.status === 200) {
        const { hospital_name } = response.data;
        return hospital_name;
      }
    } catch (error) {
      console.log('\x1b[31m ApptScreen fetchHospitalNames-> \x1b[0m', error);
    }
  };

  const convertDateCustom = (date: string) => {
    // date: string format ==> 19 Jun 2023
    const apptDateParts = date.split(' ');
    const yeaR = parseInt(apptDateParts[2], 10);
    const month = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ].indexOf(apptDateParts[1]);
    const day = parseInt(apptDateParts[0], 10);
    const dateObj = new Date(yeaR, month, day);
    return { year: yeaR, month: month, day: day, dateObj: dateObj };
  };

  const fetchAppointments = async (userId: number) => {
    // convert appt_date to Date object
    try {
      const response = await axios.get(
        `https://itp3111.as.r.appspot.com/appointment/user/${userId}`,
      );
      if (response.status === 200) {
        const allAppointments = response.data;

        // Filter appointments before today (Past appointments)
        const appointmentsBeforeToday = allAppointments.filter(
          (appointment: IAppointment) => {
            const appointmentDate = parse(
              appointment.appointment_date,
              "EEE, dd MMM yyyy HH:mm:ss 'GMT'",
              new Date(),
            );
            appointmentDate.setSeconds(
              appointmentDate.getSeconds() + appointment.appointment_time,
            );
            return isBefore(appointmentDate, localTimeNow);
          },
        );

        // Filter appointments after today (Upcoming appointments)
        const appointmentsAfterToday = allAppointments.filter(
          (appointment: IAppointment) => {
            const appointmentDate = parse(
              appointment.appointment_date,
              "EEE, dd MMM yyyy HH:mm:ss 'GMT'",
              new Date(),
            );
            appointmentDate.setSeconds(
              appointmentDate.getSeconds() + appointment.appointment_time,
            );

            return (
              isAfter(appointmentDate, localTimeNow) ||
              differenceInMinutes(appointmentDate, localTimeNow) >= 1
            );
          },
        );
        setPastAppointments(appointmentsBeforeToday);
        setUpcomingAppointments(appointmentsAfterToday);
      }
    } catch (error) {
      console.log('AppointmentScreen:', error);
    }
  };
  const [isLoading, setLoading] = useState(true); // loading indicator when first visit page
  useEffect(() => {
    setLoading(true); // Add loading circle initially
    // Get appointments for the user
    AsyncStorage.getItem('userProfileID').then(ID => {
      if (ID != null) {
        setUserID(ID); // To use outside this function
      }
    });
  }, []);

  // Refresh sectionList
  const isFocused = useIsFocused();
  const [userID, setUserID] = useState<string>();

  useEffect(() => {
    if (isFocused || userID) {
      userID ? fetchAppointments(parseInt(userID)) : null;
    } else {
      setLoading(true);
    }
  }, [isFocused, userID]);

  //          ===== SECTION LIST =====
  // For refreshing and updating past appointments
  const sectionListRef = useRef<SectionList>(null);
  const [showPastAppt, setShowPastAppt] = useState<boolean>(false); // Show past appt
  const [refreshing, setRefreshing] = useState(false); // SectionList refresh to get past appt
  const [sectionsUpcomingAppointment, setSectionsUpcomingAppt] = useState<
    SectionListData<any, {}>[]
  >([]);
  const [sectionsPastAppointment, setSectionsPastAppt] = useState<
    SectionListData<any, {}>[]
  >([]);

  const scrollToPastApptSection = () => {
    try {
      sectionListRef.current?.scrollToLocation({
        sectionIndex: 0,
        itemIndex: sectionsUpcomingAppointment[0].data.length + 1,
        animated: true,
      });
    } catch (error) {
      console.log('\x1b[91m Error animating to past appt section \x1b[0m');
      return null;
    }
  };

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
    const sortAppt = (appointments: any[], ascending: boolean) => {
      return appointments.sort(
        (
          a: { appointment_date: string; appointment_time: number },
          b: { appointment_date: string; appointment_time: number },
        ) => {
          const dateA = new Date(`${a.appointment_date}`).setSeconds(
            a.appointment_time,
          );
          const dateB = new Date(`${b.appointment_date}`).setSeconds(
            b.appointment_time,
          );
          if (ascending) {
            return dateA - dateB;
          } else {
            return dateB - dateA;
          }
        },
      );
    };

    const generateAppointmentData = async (
      appointments: any[],
      sortAscending: boolean,
    ) => {
      return await Promise.all(
        sortAppt(appointments, sortAscending).map(async appointment => {
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
      );
    };

    const pastAppointmentsData = {
      title: 'Past Appointments',
      data: await generateAppointmentData(pastAppointments, false),
    };

    const upcomingAppointmentsData = {
      title: 'Upcoming Appointments',
      data: await generateAppointmentData(upcomingAppointments, true),
    };

    setSectionsPastAppt([pastAppointmentsData]);
    setSectionsUpcomingAppt([upcomingAppointmentsData]);
    setLoading(false);
  };

  const onSectionListRefresh = () => {
    // Section List pull down to get past appointments
    if (refreshing) {
      return; // Prevent multiple refreshes
    }
    setRefreshing(true);
    if (userID) {
      // Fetch appointments
      fetchAppointments(parseInt(userID))
        .then(() => {
          formatSectionData();
          setRefreshing(false);
        })
        .catch(error => {
          console.log('Error refreshing appointments', error);
          setRefreshing(false);
        });
    }
  };

  // Dialog box & footer
  const [isFooterAdd, setFooterAdd] = useState(false);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isDialogIntentEdit, setDialogIntentEdit] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<IAppointment | null>(null);
  const onApptCardTap = (item: IAppointment) => {
    setSelectedAppointment(item);
    const itemDate = convertDateCustom(item.appointment_date);
    const itemTime = item.appointment_time.toString().split(' ');
    const itemTimeMins = parseInt(itemTime[0].split(':')[1]);
    const itemTimeHrs =
      itemTime[1] === 'AM'
        ? parseInt(itemTime[0].split(':')[0])
        : parseInt(itemTime[0].split(':')[0]) + 12;
    const itemDateTime = new Date(
      itemDate.year,
      itemDate.month,
      itemDate.day,
      itemTimeHrs,
      itemTimeMins,
    );
    new Date();
    if (isBefore(itemDateTime, localTimeNow)) {
      setDialogIntentEdit(false); // Delete intent for past appt
    } else {
      setDialogIntentEdit(true);
    }
    setDialogVisible(true);
  };

  // Whenever past or upcoming appointments edited/added, format the data & refresh
  useEffect(() => {
    formatSectionData();
    showPastAppt;
  }, [pastAppointments, upcomingAppointments, showPastAppt, refreshing]);

  useEffect(() => {
    scrollToPastApptSection();
  }, [showPastAppt]);

  const styles = StyleSheet.create({
    mainContainerBackgroundColor: {
      backgroundColor: theme.colors.background,
    },
    cardContainer: {
      borderRadius: 15,
      backgroundColor: theme.colors.background,
      elevation: 5,
      padding: 5,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 5,
      marginBottom: 5,
    },
    cardContainerToday: {
      borderRadius: 15,
      backgroundColor: theme.dark ? '#320B0B' : '#F8DEDE',
      elevation: 5,
      padding: 5,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 5,
      marginBottom: 5,
      borderColor: '#C52E2E',
      borderWidth: 8,
    },
    cardContainerTmr: {
      borderRadius: 15,
      backgroundColor: theme.dark ? '#372406' : '#FBEEDA',

      padding: 5,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 5,
      marginBottom: 5,
      borderColor: '#E99E2F',
      borderWidth: 0,
      borderLeftWidth: 10,
    },
    cardContainerPast: {
      backgroundColor: theme.dark
        ? theme.colors.onBackground
        : theme.colors.background,
    },
    cardContainerUpcoming: {
      borderLeftColor: '#58AF90',
      borderLeftWidth: 10,
      borderRadius: 15,
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
      color: theme.dark ? '#F49ABE' : '#A81A55',
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
    footerText: {
      color: theme.colors.outline,
      textAlign: 'center',
      padding: 15,
      paddingTop: 20,
      fontSize: 18,
      lineHeight: 25,
    },
  });

  return (
    <>
      <SafeAreaView
        style={[mainContainer.container, styles.mainContainerBackgroundColor]}
      >
        {/* Header */}
        <Header headerText={'Appointments'} />
        <TouchableOpacity
          onPress={() => {
            navigateToAddAppt();
          }}
        >
          <Text style={[styles.addNewApptBtn]}>+{'\u00A0'} Add new Appt</Text>
        </TouchableOpacity>

        {/* ===== MAIN CONTENT ===== */}
        {/* SectionList */}
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <SectionList
            ref={sectionListRef}
            sections={
              showPastAppt
                ? // Show past appointmets
                  ([
                    ...sectionsUpcomingAppointment,
                    ...sectionsPastAppointment,
                  ] as SectionListData<IAppointment>[])
                : // Show upcoming appointments only
                  ([
                    ...sectionsUpcomingAppointment,
                  ] as SectionListData<IAppointment>[])
            }
            renderItem={({ item, section }) => {
              const convertedDate = convertDateCustom(item.appointment_date);
              const apptDate = new Date(
                convertedDate.year,
                convertedDate.month,
                convertedDate.day,
              );

              // Time formatting >.>
              const timeParts = item.appointment_time.toString().split(':');
              let hours = parseInt(timeParts[0], 10);
              const minutes = parseInt(timeParts[1], 10);
              if (
                item.appointment_time.toString().includes('PM') &&
                hours !== 12
              ) {
                hours += 12;
              }
              const sam = hours * 3600 + minutes * 60; // sec after midnight

              // Adding it to apptDate
              apptDate.setSeconds(apptDate.getSeconds() + sam);

              // Tmr adjustment
              const tomorrow = new Date();
              tomorrow.setUTCDate(localTimeNow.getDate() + 1);

              // Comparing
              const isItSameDay =
                differenceInMinutes(apptDate, localTimeNow) < 24 * 60; // within 24hrs (960min)
              const isItTmr = differenceInMinutes(apptDate, tomorrow) < 36 * 60; // within 36hrs (2160min)

              return (
                <TouchableOpacity
                  onPress={() => onApptCardTap(item)}
                  style={
                    section.title === 'Upcoming Appointments'
                      ? isItSameDay
                        ? [styles.cardContainerToday] // same day & upcoming
                        : isItTmr
                        ? styles.cardContainerTmr // tmr & upcoming
                        : [styles.cardContainer, styles.cardContainerUpcoming] // not soon & upcoming
                      : [styles.cardContainer, styles.cardContainerPast] // past
                  }
                >
                  {/* Content in each card */}
                  <View>
                    <View
                      style={
                        section.title === 'Upcoming Appointments'
                          ? isItSameDay
                            ? null // same day & upcoming
                            : isItTmr // tmr & upcoming
                            ? {
                                borderRadius: 10,
                              }
                            : null // not soon & upcoming
                          : styles.cardContainerPast // past
                      }
                    >
                      <Text style={[styles.apptItemDateTime]}>
                        {item.appointment_date}
                      </Text>
                      <Text style={[styles.apptItemDateTime]}>
                        {item.appointment_time}
                      </Text>
                      <Text style={[styles.apptItem]}>
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
              );
            }}
            renderSectionHeader={({ section }) => (
              <Text style={styles.apptSectionHeader}>{section.title}</Text>
            )}
            renderSectionFooter={({ section }) => (
              <>
                {
                  // Control which footer will appear under upcomingg appt section
                  section.title === 'Upcoming Appointments'
                    ? section.data.length === 0 // 0 upcoming appt
                      ? setFooterAdd(true) // add new appt txt
                      : setFooterAdd(false) // >0 upcoming appt, show past appt txt
                    : null
                }

                {/* Render footer */}
                {isFooterAdd && (
                  <TouchableOpacity
                    onPress={() => {
                      navigateToAddAppt();
                      setShowPastAppt(false);
                    }}
                  >
                    <Text
                      style={styles.footerText}
                    >{`No upcoming appointments.\nAdd a new appointment?`}</Text>
                  </TouchableOpacity>
                )}
                {!isFooterAdd && !showPastAppt ? (
                  <TouchableOpacity
                    onPress={() => {
                      setShowPastAppt(true);
                    }}
                  >
                    <Text
                      style={styles.footerText}
                    >{`No upcoming appointments left. \n Tap here to see past appointments.`}</Text>
                  </TouchableOpacity>
                ) : null}
                <Text
                  style={styles.footerText}
                  onPress={() => setFooterAdd(false)}
                ></Text>
              </>
            )}
            keyExtractor={item => `basicListEntry-${item.appointment_id}`}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onSectionListRefresh}
                colors={[theme.colors.primary]}
              />
            }
          />
        )}

        {/* Dialogbox */}
        {isDialogVisible && (
          <ApptDialog
            appt={selectedAppointment}
            btnMessage={
              isDialogIntentEdit ? 'Edit Appointment' : 'Delete Appointment'
            }
            onClose={() => setDialogVisible(false)}
          />
        )}
      </SafeAreaView>
    </>
  );
};

export default AppointmentScreen;
