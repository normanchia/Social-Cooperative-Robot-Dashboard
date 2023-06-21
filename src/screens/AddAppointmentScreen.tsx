// Docs on dropdown picker: https://hossein-zare.github.io/react-native-dropdown-picker-website/docs/rules
// Docs on dateTime picker: https://github.com/henninghall/react-native-date-picker#example-1-modal

import React, { Children, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Button,
  TouchableHighlight,
  TextInput,
  ScrollView,
} from 'react-native';

import { mainContainer, bodyContainer, colors } from '../styles/styles';
import Header from '../components/Header';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import DropDownPicker, {
  DropDownPickerProps,
} from 'react-native-dropdown-picker';
import { showToast } from '../util/action';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RelaxView } from '../introduction_animation/scenes';
import DatePicker from 'react-native-date-picker';
import { FullWindowOverlay } from 'react-native-screens';
import { useTheme } from 'react-native-paper';
import { formatISO, isDate, parse } from 'date-fns';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Appointment {
  appointment_id: number;
  hospital_id: number;
  hospital_name: string;
  appointment_time: number;
  appointment_date: string;
  additional_note: string;
  appointment_title: string;
}

const AddAppointmentScreen: React.FC = () => {
  //    Seeing which page it came from    //
  const route = useRoute();
  const { appointment, screenIntent } = route.params as {
    appointment: Appointment;
    screenIntent: String;
  };
  const [isIntentEdit, setIsIntentEdit] = useState(false);
  const [isIntentAdd, setIsIntentAdd] = useState(false);
  const [userID, setUserID] = useState(0);

  const getTodayDate = () => {
    const today = new Date();
    const weekdayList = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    const timezoneOffset = today.getTimezoneOffset(); // Current offset in minutes
    const durationInMinutes = 60; // It's getting GMT7, we live in GMT8 LOL
    const newOffset = timezoneOffset + durationInMinutes;
    const adjustedToday = new Date(today.getTime() + newOffset * 60 * 1000);
    setDateTimeNOW(adjustedToday);
    // setDate(adjustedToday); // set the dateTime as NOW

    const weekday = weekdayList[adjustedToday.getUTCDay()];
    const day = adjustedToday.getUTCDate();
    const month = formatMMM(adjustedToday.getUTCMonth());
    const year = adjustedToday.getUTCFullYear();

    // Setting the respective values
    setWeekday(weekday);
    setDay(`${day}`);
    setMonth(month);
    setYear(`${year}`);
  };

  //  Change states based on which page it came from
  useEffect(() => {
    // set userID to parse to DB
    AsyncStorage.getItem('userProfileID').then(ID => {
      if (ID != null) {
        setUserID(parseInt(ID));
      }
    });

    // Force date to be today to prevent error
    getTodayDate();

    // If came from editAppointment screen
    if (screenIntent === 'editAppointment') {
      // Edit appointment
      setIsIntentEdit(true);
      setHeaderValue('Edit Appointment'); // Header
      setTitleValue(appointment?.appointment_title); // Title
      setNotesValue(appointment?.additional_note); // Notes
      setButtonValue('Update!'); // Button

      // Date
      setIsDateVisible(true);
      const weekdayRegex = /\((.*?)\)/;
      const dayRegex = /[0-9]+/;
      const monthRegex = /[A-Za-z]+/;
      const yearRegex = /\d{4}/;

      const weekdayEdit = weekdayRegex.exec(appointment?.appointment_date);
      const dayEdit = dayRegex.exec(appointment?.appointment_date);
      const monthEdit = monthRegex.exec(appointment?.appointment_date);
      const yearEdit = yearRegex.exec(appointment?.appointment_date);
      let weekdayWordOnly;

      dayEdit ? setDay(dayEdit[0]) : setDay('error');
      monthEdit ? setMonth(monthEdit[0]) : setMonth('error');
      yearEdit ? setYear(yearEdit[0]) : setYear('error');
      if (weekdayEdit) {
        setWeekday(weekdayEdit[1]);
        weekdayWordOnly = weekdayEdit[1];
      } else {
        setWeekday('Day');
      }

      // Setting Time to display
      setIsTimeVisible(true);
      setDisplayTime(`${appointment?.appointment_time}`);
      if (
        weekdayWordOnly &&
        dayEdit &&
        monthEdit &&
        yearEdit &&
        appointment?.appointment_time !== null
      ) {
        updateDateTime(
          weekdayWordOnly,
          dayEdit[0],
          monthEdit[0],
          yearEdit[0],
          `${appointment?.appointment_time}`,
        );
      }

      // Location
      setValueLocation(`${appointment.hospital_id}`);
    } else {
      // screenIntent = 'addAppointment' from AppointmentScreen
      // For the moment this else is only Add Appointment so nth special
      setIsIntentAdd(true);
    }
  }, []);

  const updateDateTime = (
    day: string,
    dd: string,
    mmm: string,
    yyyy: string,
    timeString: string,
  ) => {
    console.debug(
      'updateDateTime() line 135 check:',
      day,
      dd,
      mmm,
      yyyy,
      timeString,
    );
    const timeParts = timeString.toString().split(' '); //[12:59, PM]
    const time12h = timeParts[0]; // 12:59
    const amOrPm = timeParts[1]; // AM/PM
    const [hours, minutes] = time12h.split(':');
    let hours24;

    if (amOrPm === 'AM') {
      hours24 = hours === '12' ? '00' : hours; // if 12AM, change to 00, else keep hours
    } else {
      hours24 = hours === '12' ? '12' : parseInt(hours) + 12; // if 12PM, dont need change, else add 12 for 24HR(1pm -> 1300)
    }

    // Storing date time ==> Don't forget to isoDate.toISOString() before sending to server ya?!!!!!!
    const isoDate = new Date(
      `${day}, ${dd} ${mmm} ${yyyy} ${hours24}:${minutes}:00`,
    );
    setDate(isoDate);

    // Updating state for use in DB
    const ssms = parseInt(hours24.toString()) * 3600 + parseInt(minutes) * 60;
    setSecondsSinceMidnightServer(ssms);
    const tmpDateObj = new Date(ssms * 1000);
    const timeServerSend = tmpDateObj.toLocaleTimeString('en-US', {
      timeZone: 'UTC',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Setting backend to be the same
    setTimeServer(timeServerSend.toString());
    setDateServer(formatISODateToServerDate(isoDate)); //YYYY-mm-dd
  };

  //    Navigation and updating DB  //
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [secondsSinceMidnightServer, setSecondsSinceMidnightServer] =
    useState<number>();
  const [timeServer, setTimeServer] = useState<string>();
  const [dateServer, setDateServer] = useState<string>();
  const extractData = () => {
    printToast('');

    const appointmentData = {
      hospital_id: valueLoc,
      user_id: userID,
      reminder_time: timeServer, //   ========== CHANGE REMINDER_TIME ==========
      reminder_date: dateServer, //   ========== CHANGE REMINDER_DATE ==========
      appointment_time: timeServer,
      appointment_date: dateServer,
      additional_note: notesValue,
      appointment_title: titleValue,
    };
    console.debug('line 196 Appt info:', appointmentData, '\n');
    return appointmentData;
    // navigation.navigate('AppointmentScreen', null); // Navigate back
  };

  //   Formatting     //
  const formatISODateToServerDate = (isoDate: Date) => {
    return isoDate.toISOString().split('T')[0]; // 2023-06-16T18:05:00.000Z ===> 2023-06-16
  };
  const formatDD = (dm: number) => {
    return dm < 10 ? `0${dm}` : dm.toString();
  };
  const formatMMM = (monthNo: number) => {
    const months = [
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
    ];
    return months[monthNo];
  };

  //   Update database    //
  const updateDatabase = async (apptID: number, apptData: any) => {
    try {
      const response = await axios.put(
        `http://10.0.2.2:5000/appointment/${apptID}`,
        JSON.stringify(apptData),
        { headers: { 'Content-Type': 'application/json' } },
      );
      if (response.status === 200) {
        showToast('✅ Successfully updated');
        // navigation.navigate('AppointmentScreen', { forceRefresh: 'fromAppt' }); // Navigate back
        navigation.goBack();
      } else {
        showToast('Error updating appointment, please try again later.');
      }
    } catch (error) {
      console.log('Error updating appointment:', error);
    }
  };

  //   Add to database    //
  const createAppointmentDatabase = async (apptData: any) => {
    try {
      const response = await axios.post(
        `http://10.0.2.2:5000/appointment`,
        JSON.stringify(apptData),
        { headers: { 'Content-Type': 'application/json' } },
      );
      if (response.status === 200) {
        console.log('NEW APPT CREATED??!!');
        navigation.goBack();
      } else {
        console.log('sadge');
      }
    } catch (error) {
      console.log('Error creating appointment:', error);
    }
  };

  //   Delete from database   //
  const deleteAppointmentDatabase = async (apptID: number) => {
    try {
      const response = await axios.delete(
        `http://10.0.2.2:5000/appointment/${apptID}`,
      );
      if (response.status === 200) {
        showToast('Appointment deleted!');
        navigation.goBack();
      } else {
        showToast('Error deleting appointment, please try again later.');
      }
    } catch (error) {
      console.log('Error deleting appointment:', error);
    }
  };

  //   For Header, Title and Button Value   //
  const [headerValue, setHeaderValue] = useState('Add a new appointment!');
  const [titleValue, setTitleValue] = useState('');
  const [buttonValue, setButtonValue] = useState('Add appointment!');

  //   For Location Dropdown //
  const [openLoc, setOpenLocation] = useState(false); // controls the dropdown opening
  const [valueLoc, setValueLocation] = useState<string | null>(null); // value of item selected
  const [itemsLoc, setItemsLocation] = useState([
    { label: 'Singapore General Hospital', value: '1' },
    { label: 'National University Hospital', value: '2' },
    { label: 'Changi General Hospital', value: '3' },
    { label: 'Tan Tock Seng Hospital', value: '4' },
    { label: 'Mount Elizabeth Hospital', value: '5' },
  ]);

  //    For datetime picker     //
  const [dateTimeNOW, setDateTimeNOW] = useState<Date>();
  const [dateTime, setDate] = useState(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [dateButtonTitle, setDateButtonTitle] = useState('Add Date');
  const [timeButtonTitle, setTimeButtonTitle] = useState('Add Time');
  const [dateTimeSelectorColor, setDateTimeSelectorColor] = useState(
    'backgroundColor: colors.primary',
  );

  //    For displaying date/ time  //
  const [isDateVisible, setIsDateVisible] = useState(false);
  const [isTimeVisible, setIsTimeVisible] = useState(false);
  const [time, setDisplayTime] = useState('00:00 AM');
  const [weekday, setWeekday] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  //    For notes   //
  const [isNotesFocused, setIsNotesFocused] = useState(false);
  const [notesValue, setNotesValue] = useState('');

  //    For debug   //
  const printToast = (message: string) => {
    // showToast('🅰️' + titleValue + '🏠' + valueLoc + '📅' + dateTime);
  };

  //    Theme stuff //
  const theme = useTheme();
  const dropDownTheme = theme.dark ? 'DARK' : 'LIGHT';
  const styles = StyleSheet.create({
    flexAlignMiddle: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center',
    },
    timeText: {
      fontSize: 40,
      fontWeight: 'bold',
      textAlign: 'center',
      textAlignVertical: 'center',
      color: theme.colors.secondary,
    },
    weekdayText: {
      textAlign: 'center',
      fontSize: 22,
    },
    dayText: {
      textAlign: 'center',
      fontSize: 40,
      color: theme.colors.secondary,
      fontWeight: 'bold',
      // borderWidth: 1,
      // borderColor: '#e1f',
    },
    monthText: {
      textAlign: 'center',
      fontSize: 28,
      marginTop: -10,
      // borderWidth: 1,
      // borderColor: '#1ef',
    },
    yearText: {
      textAlign: 'center',
      fontSize: 22,
    },
    dateTimeCardContainer: {
      flex: 5,
      aspectRatio: 1,
      borderRadius: 15,
      backgroundColor: theme.dark ? theme.colors.primary : '#fff',
      elevation: 5,
      padding: 5,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 5,
      marginBottom: 5,
    },
    arrowIcon: {
      fontSize: 20,
    },
    calendarIcon: {
      textAlign: 'center',
      fontSize: 50,
      borderRadius: 30,
      padding: 10,
      color: theme.dark ? theme.colors.secondary : '#121',
    },
    pickDateTextComp: {
      // For commented out emojis
      color: theme.colors.secondary,
      fontSize: 50,
      textAlign: 'center',
      // borderWidth: 1,
      // borderColor: '#1ef',
    },
    pickDateText: {
      color: theme.dark ? theme.colors.secondary : '#121',
      fontSize: 20,
      textAlign: 'center',
      // fontWeight: 'bold',
      // borderWidth: 1,
      // borderColor: '#f1e',
    },
    backgroundColorSetWhite: { backgroundColor: theme.colors.background },
    sectionHeader: {
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
      marginTop: 15,
      marginLeft: -20,
      marginRight: -20,
      marginBottom: 5,
    },

    placeholderStyleCustom: {
      borderRadius: 10,
      backgroundColor: theme.dark ? theme.colors.primary : 'transparent',
      padding: 10,
    },

    rowStyle: {
      flexDirection: 'row',
      // marginTop: 10,
      alignContent: 'space-around',
      // borderWidth: 1,
      // borderColor: '#f1e',
    },

    buttonDT: { backgroundColor: theme.colors.primary, zIndex: 1000 },
    deleteApptBtn: {
      color: theme.colors.background,
      borderRadius: 5,
      position: 'absolute',
      bottom: 10,
      right: 10,
      backgroundColor: theme.colors.secondary,
      paddingHorizontal: 10,
      paddingVertical: 10,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  return (
    <>
      <SafeAreaView
        style={[
          mainContainer.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        {/* Header */}
        <Header headerText={headerValue} />
        {/* Delete appointment button */}
        {screenIntent === 'editAppointment' && (
          <TouchableOpacity
            onPress={() => {
              deleteAppointmentDatabase(appointment.appointment_id);
            }}
          >
            <Text style={[styles.deleteApptBtn]}>
              <Icon name="delete" size={15}></Icon>
              {'\u00A0'} Delete{' '}
            </Text>
          </TouchableOpacity>
        )}

        {/* Main Content */}
        <ScrollView>
          <View
            style={{
              margin: 20,
              flexDirection: 'column',
            }}
          >
            {/* Appointment Title */}
            <Text style={[styles.sectionHeader, { marginTop: -20 }]}>
              Appointment Title
            </Text>
            <TextInput
              style={{
                height: 50,
                fontSize: 20,
                color: theme.colors.secondary,
              }}
              placeholder="Click here to add additional title!"
              placeholderTextColor={theme.colors.secondary}
              multiline
              textAlignVertical="top" // so ios and android same behavior
              maxLength={30} // 30 characters per line
              returnKeyType="done"
              onFocus={() => setIsNotesFocused(true)}
              onBlur={() => setIsNotesFocused(false)}
              onChangeText={text => setTitleValue(text)}
              value={titleValue}
            />

            {/* Location dropdown */}
            <Text style={[styles.sectionHeader, { marginTop: 0 }]}>
              Select appointment location
            </Text>
            <View style={(styles.rowStyle, { zIndex: 9000, height: 60 })}>
              <View style={{ flex: 1 }}>
                <DropDownPicker
                  placeholder={'🏥 Select hospital'}
                  placeholderStyle={styles.placeholderStyleCustom}
                  theme={dropDownTheme}
                  dropDownContainerStyle={{}}
                  selectedItemContainerStyle={{
                    backgroundColor: theme.colors.primary,
                  }}
                  dropDownDirection="AUTO"
                  showTickIcon={true}
                  open={openLoc}
                  value={valueLoc}
                  items={itemsLoc}
                  setOpen={setOpenLocation}
                  setValue={setValueLocation}
                  setItems={setItemsLocation}
                  autoScroll={true}
                  // listMode="MODAL" // For wholescreen
                  listMode="SCROLLVIEW"
                />
              </View>
            </View>

            {/* Date and time Card */}
            <Text style={styles.sectionHeader}>Select date and time</Text>
            <View style={styles.rowStyle}>
              {/* Date card */}
              <TouchableOpacity
                style={[
                  styles.dateTimeCardContainer,
                  isDateVisible && styles.backgroundColorSetWhite,
                ]}
                onPress={() => setOpenDate(true)}
              >
                {/* After date is selected, hide prompt and show date */}
                {!isDateVisible && (
                  <View style={styles.flexAlignMiddle}>
                    <Icon
                      size={30}
                      name="calendar-today"
                      style={styles.calendarIcon}
                    />
                    <Text style={styles.pickDateText}>{dateButtonTitle}</Text>
                  </View>
                )}

                {isDateVisible && (
                  <View style={styles.flexAlignMiddle}>
                    <Text style={styles.weekdayText}>{weekday}</Text>
                    <Text style={styles.dayText}>
                      {day} {month}
                    </Text>
                    <Text style={styles.yearText}>{year}</Text>
                  </View>
                )}

                <DatePicker
                  modal
                  mode="date"
                  minimumDate={dateTimeNOW}
                  minuteInterval={5}
                  open={openDate}
                  date={dateTime}
                  onConfirm={date => {
                    setOpenDate(false);
                    setDate(date);
                    // const dateString = date.toDateString();   // For date - unused atm
                    const fullDateTime = date.toLocaleString('en-US', {
                      weekday: 'long',
                    });
                    const weekday = fullDateTime.split(',')[0].trim();
                    const month = date.toLocaleString('en-US', {
                      month: 'short',
                    });
                    const day = date.toLocaleString('en-US', {
                      day: '2-digit',
                    });
                    const year = date.toLocaleString('en-US', {
                      year: 'numeric',
                    });

                    // Setting the respective values
                    setWeekday(weekday);
                    setDay(day);
                    setMonth(month);
                    setYear(year);
                    setIsDateVisible(true);

                    // Update data for sending
                    updateDateTime(weekday, day, month, year, time);
                  }}
                  onCancel={() => {
                    setOpenDate(false);
                  }}
                />
              </TouchableOpacity>

              {/* Time Card */}
              <TouchableOpacity
                style={[
                  styles.dateTimeCardContainer,
                  isTimeVisible && styles.backgroundColorSetWhite,
                ]}
                onPress={() => setOpenTime(true)}
              >
                {!isTimeVisible && (
                  <View style={styles.flexAlignMiddle}>
                    {/* <Text style={styles.pickDateTextComp}>🕑</Text> */}
                    <Icon name="schedule" style={styles.calendarIcon} />
                    <Text style={styles.pickDateText}>{timeButtonTitle}</Text>
                  </View>
                )}
                {isTimeVisible && (
                  <View style={styles.flexAlignMiddle}>
                    <Text style={styles.timeText}>{time}</Text>
                  </View>
                )}

                <DatePicker
                  modal
                  mode="time"
                  minuteInterval={5}
                  open={openTime}
                  date={dateTime}
                  onConfirm={date => {
                    setOpenTime(false);
                    setDate(date);

                    //   Setting the time value
                    const time = date.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                    setDisplayTime(time);
                    setIsTimeVisible(true);

                    // Update data for sending
                    updateDateTime(weekday, day, month, year, time);
                  }}
                  onCancel={() => {
                    setOpenTime(false);
                  }}
                />
              </TouchableOpacity>
            </View>

            {/* Notes */}
            <Text style={styles.sectionHeader}>Notes</Text>
            <TextInput
              style={{
                height: 100,
                fontSize: 20,
                color: theme.colors.secondary,
              }}
              placeholder="Click here to add additional notes!"
              placeholderTextColor={theme.colors.secondary}
              multiline
              textAlignVertical="top" // so ios and android same behavior
              maxLength={40} // 40 characters per line
              numberOfLines={3} // max 3 lines
              returnKeyType="done"
              onFocus={() => setIsNotesFocused(true)}
              onBlur={() => setIsNotesFocused(false)}
              onChangeText={text => setNotesValue(text)}
              value={notesValue}
            />
          </View>
        </ScrollView>

        {/* Final submit button */}
        {!isNotesFocused && (
          <TouchableOpacity
            onPress={() => {
              if (screenIntent === 'editAppointment') {
                updateDatabase(appointment.appointment_id, extractData());
              } else if (screenIntent === 'addAppointment') {
                // Validation
                if (isTimeVisible && isDateVisible && valueLoc !== null) {
                  createAppointmentDatabase(extractData());
                } else {
                  showToast(
                    '❗Please ensure date, time and hospitals are selected.',
                  );
                }
              }
            }}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 15,
              position: 'absolute',
              left: 115,
              right: 115,
              bottom: 20,
              backgroundColor: colors.primary,
              paddingHorizontal: 20,
              paddingVertical: 20,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              {buttonValue}
            </Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </>
  );
};

export default AddAppointmentScreen;
