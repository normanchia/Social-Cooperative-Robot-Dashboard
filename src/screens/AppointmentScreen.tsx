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
import { ScrollView } from 'react-native-gesture-handler';
import { showToast } from '../util/action';
import {
  useNavigation,
  NavigationProp,
  ParamListBase,
  useIsFocused,
} from '@react-navigation/native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
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
import { da } from 'date-fns/locale';
import { transparent } from 'react-native-paper/lib/typescript/src/styles/themes/v2/colors';
import { formatISO } from 'date-fns/esm';

const testToast = () => {
  showToast('This is a test toast 🍞');
};

interface IAppointment {
  appointment_id: number;
  hospital_id: number;
  hospital_name: string;
  appointment_time: number;
  appointment_date: string;
  additional_note: string;
  appointment_title: string;
}

// interface iSectionToggle {
//   title: string;
//   data: { text: string }[];
// }

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
  const [pastAppointments, setPastAppointments] = useState<IAppointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    IAppointment[]
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
      console.log('\x1b[31m ApptScreen fetchHospitalNames-> \x1b[0m', error);
    }
  };

  const [hourCDC, setHour] = useState<number>();
  const [minuteCDC, setMinute] = useState<number>();
  const [dateTimeObjCDC, setdateTimeObj] = useState<Date>();
  const convertDateCustom = (date: string) => {
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
        `http://10.0.2.2:5000/appointment/user/${userId}`,
      );
      if (response.status === 200) {
        const today = new Date();
        today.setUTCHours(today.getUTCHours() + 8);
        const allAppointments = response.data;

        // Filter appointments before today
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
            appointmentDate.setUTCHours(appointmentDate.getUTCHours() - 7); //appt date correct
            return isBefore(appointmentDate, today);
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
            appointmentDate.setUTCHours(appointmentDate.getUTCHours() - 7); //appt date correct
            // console.log(
            //   appointmentDate,
            //   '<->',
            //   '\ttoday',
            //   today,
            //   isAfter(appointmentDate, today),
            // );

            return (
              isAfter(appointmentDate, today) ||
              differenceInMinutes(appointmentDate, today) >= 1
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
  const [loading, setLoading] = useState(false); // loading indicator when first visit page
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
    setLoading(true); // Add loading circle initially
    if (isFocused || userID) {
      // console.log('refreshing sectionlist...');
      userID ? fetchAppointments(parseInt(userID)) : null;
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

    const pastAppointmentsData = {
      title: 'Past Appointments',
      data: await Promise.all(
        sortAppt(pastAppointments, false).map(async appointment => {
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
        sortAppt(upcomingAppointments, true).map(async appointment => {
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
    if (refreshing) {
      // Prevent multiple refreshes
      return;
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

  // Dialog box
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<IAppointment | null>(null);
  const onApptCardTap = (item: IAppointment) => {
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
    cardContainerToday: {
      borderRadius: 15,
      backgroundColor: theme.colors.errorContainer,
      elevation: 10,
      padding: 5,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 5,
      marginBottom: 5,
      borderColor: theme.colors.error,
      borderWidth: 4,
    },
    cardContainerTmr: {
      borderRadius: 15,
      backgroundColor: 'orange',
      elevation: 10,
      padding: 5,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 5,
      marginBottom: 5,

      borderColor: 'orange',
      borderWidth: 2,
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
    footerText: {
      color: theme.colors.secondary,
      textAlign: 'center',
      padding: 10,
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
        <TouchableOpacity onPress={navigateToAddAppt}>
          <Text style={[styles.addNewApptBtn]}>+{'\u00A0'} Add new Appt</Text>
        </TouchableOpacity>

        {/* ===== MAIN CONTENT ===== */}

        {/* SectionList */}
        {loading ? (
          <>
            <ActivityIndicator
              style={{ marginTop: 20 }}
              size={'large'}
              color={theme.colors.primary}
            />
          </>
        ) : (
          <SectionList
            sections={
              [
                ...sectionsUpcomingAppointment,
                ...sectionsPastAppointment,
              ] as SectionListData<IAppointment>[]
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

              // Today adjustment
              const todaY = new Date();
              todaY.setUTCHours(new Date().getUTCHours() + 8);

              // Tmr adjustment
              const tomorrow = new Date();
              tomorrow.setUTCDate(new Date().getUTCDate() + 1);

              // COmparing
              const isItSameDay = differenceInMinutes(apptDate, todaY) < 720; // within 12hrs
              const isItTmr = differenceInMinutes(apptDate, tomorrow) < 2160; // within 36hrs
              console.log(apptDate, '<->', todaY);

              // const isItSameDay = isSameDay(apptDate, todaY);
              // const isItTmr = isSameDay(apptDate, tomorrow);

              return (
                <TouchableOpacity
                  onPress={() => onApptCardTap(item)}
                  style={
                    section.title === 'Upcoming Appointments'
                      ? isItSameDay
                        ? [styles.cardContainerToday]
                        : isItTmr
                        ? styles.cardContainerTmr
                        : styles.cardContainer
                      : [styles.cardContainer, styles.cardContainerPast]
                  }
                >
                  {/* Content in each card */}
                  <View>
                    <View
                      style={
                        section.title === 'Upcoming Appointments'
                          ? isItSameDay
                            ? {
                                borderLeftWidth: 0,
                                borderRadius: 10,
                                // backgroundColor: theme.colors.errorContainer,
                              }
                            : isItTmr
                            ? {
                                borderRadius: 10,
                                backgroundColor: theme.colors.background,
                              }
                            : [styles.cardContainerUpcoming]
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
              );
            }}
            renderSectionHeader={({ section }) => (
              <Text style={styles.apptSectionHeader}>{section.title}</Text>
            )}
            renderSectionFooter={({ section }) => (
              <Text
                style={styles.footerText}
                onPress={() => navigateToAddAppt()}
              >
                {section.data.length === 0
                  ? `No upcoming appointments.\nAdd a new appointment?`
                  : null}
              </Text>
            )}
            keyExtractor={item => `basicListEntry-${item.appointment_id}`}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary]}
              />
            }
          />
        )}

        {/* Dialogbox */}
        {isDialogVisible && (
          <ApptDialog
            appt={selectedAppointment}
            btnMessage="Edit Appointment"
            onClose={() => setDialogVisible(false)}
          />
        )}
      </SafeAreaView>
    </>
  );
};

export default AppointmentScreen;
