// Docs on dropdown picker: https://hossein-zare.github.io/react-native-dropdown-picker-website/docs/rules
// Docs on dateTime picker: https://github.com/henninghall/react-native-date-picker#example-1-modal

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Keyboard,
} from 'react-native';

import { mainContainer, colors } from '../styles/styles';
import Header from '../components/Header';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import { showToast } from '../util/action';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-date-picker';
import { useTheme } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import isBefore from 'date-fns/isBefore';
import LoadingIndicator from '../components/LoadingIndicator';
import ApptDialog from '../components/ApptDialog';

interface IAppointment {
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
    appointment: IAppointment;
    screenIntent: String;
  };
  const [isIntentEdit, setIsIntentEdit] = useState(false);
  const [isIntentAdd, setIsIntentAdd] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [userID, setUserID] = useState(0);

  //    Keyboard focus    //
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  //    Date Time stuff    //
  const localTimeNow = new Date();
  const getandSetTodayDate = () => {
    const weekdayList = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    setDateTimeNOW(localTimeNow); // Used in <DatePicker> component as min date

    const weekday = weekdayList[localTimeNow.getDay()];
    const day = localTimeNow.getDate();
    const month = formatMMM(localTimeNow.getMonth());
    const year = localTimeNow.getFullYear();

    // Setting the respective values
    setWeekday(weekday);
    setDay(`${day}`);
    setMonth(month);
    setYear(`${year}`);

    // console.log(`Today is ${weekday}, ${day} ${month} ${year}`);
  };

  //  Change states based on which page it came from
  useEffect(() => {
    // set userID to parse to DB
    AsyncStorage.getItem('userProfileID').then(ID => {
      if (ID != null) {
        setUserID(parseInt(ID));
      }
    });

    // Force date to be today to prevent undefined date error
    getandSetTodayDate();

    // If came from editAppointment screen
    if (screenIntent === 'editAppointment') {
      // Edit appointment
      setIsIntentEdit(true); // Customization & logic
      setHeaderValue('Edit Appointment'); // Header
      setTitleValue(appointment?.appointment_title); // Title
      setValueLocation(`${appointment.hospital_id}`); // Location
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
      console.debug('line 149', appointment.appointment_time);
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
    } else {
      // else screenIntent = 'addAppointment' from AppointmentScreen
      setDisplayTime(
        // Set display time to be ahead of now by 4 minutes so time card will display next 5 min interval instead of past
        formatTime(localTimeNow.getHours(), localTimeNow.getMinutes() + 4),
      );
      setIsIntentAdd(true); // Customization and logic
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

    // Final formatting before sending to DB
    const isoDate = new Date(
      `${day}, ${dd} ${mmm} ${yyyy} ${hours24}:${minutes}:00`,
    );
    const timeServerSend = `${hours24}:${minutes}:00`;
    const dateServerSend = `${yyyy}-${isoDate.getMonth() + 1}-${dd}`; // YYYY-mm-dd

    setDate(isoDate); // Setting frontend to be the same

    // Setting backend to be the same
    setTimeServer(timeServerSend.toString());
    setDateServer(dateServerSend); //YYYY-mm-dd
  };

  //   Formatting     //
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
  const formatTime = (hours: number, min: number) => {
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    const minStr = min < 10 ? `0${min}` : min;
    return `${hours12}:${minStr} ${amOrPm}`;
  };

  //   Loading Indicators   //
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //    Navigation and updating DB  //
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [timeServer, setTimeServer] = useState<string>();
  const [dateServer, setDateServer] = useState<string>();
  const extractData = () => {
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
    console.debug('line 241 Appt info:', appointmentData, '\n');
    return appointmentData;
  };

  //   Update database    //
  const updateDatabase = async (apptID: number, apptData: any) => {
    try {
      const response = await axios.put(
        `https://itp3111.as.r.appspot.com/appointment/${apptID}`,
        JSON.stringify(apptData),
        { headers: { 'Content-Type': 'application/json' } },
      );
      if (response.status === 200) {
        showToast('✅ Successfully updated');
        setIsLoading(false);
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
        `https://itp3111.as.r.appspot.com/appointment`,
        JSON.stringify(apptData),
        { headers: { 'Content-Type': 'application/json' } },
      );
      if (response.status === 200) {
        setIsLoading(false);
        navigation.goBack();
      } else {
        console.log('sadge');
      }
    } catch (error) {
      console.log('Error creating appointment:', error);
      setIsLoading(false);
      showToast('Error creating appointment, please try again later.');
    }
  };

  //   Delete from database   //
  const deleteAppointmentDatabase = async (apptID: number) => {
    try {
      const response = await axios.delete(
        `https://itp3111.as.r.appspot.com/appointment/${apptID}`,
      );
      if (response.status === 200) {
        showToast('Appointment deleted!');
        setIsLoading(false);
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
  const [openSpecificLoc, setOpenSpecificLocation] = useState(false); // controls the specifics loc dropdown opening
  const [valueLoc, setValueLocation] = useState<string | null>(null); // value of item selected
  const [valueSpecificLoc, setValueSpecificLocation] = useState<string | null>(
    null,
  ); // value of item selected
  const [itemsLoc, setItemsLocation] = useState([
    { label: 'Singapore General Hospital', value: '1' },
    { label: 'National University Hospital', value: '2' },
    { label: 'Changi General Hospital', value: '3' },
    { label: 'Tan Tock Seng Hospital', value: '4' },
    { label: 'Mount Elizabeth Hospital', value: '5' },
  ]);
  const [itemsSpecificLoc, setItemsSpecificLocation] = useState([
    { label: 'Main Lobby', value: 'Main Lobby' },
    { label: 'A&E', value: 'A&E' },
    { label: 'Tower A', value: 'Tower A' },
    { label: 'Tower B', value: 'Tower B' },
    { label: 'Dental Clinic', value: 'Dental Clinic' },
    { label: 'Walk-in Clinic', value: 'Walk-in Clinic' },
    { label: 'Pharmacy', value: 'Pharmacy' },
  ]);
  const onHospitalLocOpen = useCallback(() => {
    setOpenSpecificLocation(false);
  }, []);
  const onSpecificLocOpen = useCallback(() => {
    setOpenLocation(false);
  }, []);
  useEffect(() => {
    valueSpecificLoc && setNotesValue(valueSpecificLoc.toString());
  }, [valueSpecificLoc]);

  //    For datetime picker     //
  const [dateTimeNOW, setDateTimeNOW] = useState<Date>();
  const [dateTime, setDate] = useState(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [dateButtonTitle, setDateButtonTitle] = useState('Add Date');
  const [timeButtonTitle, setTimeButtonTitle] = useState('Add Time');

  //    For displaying date/ time  //
  const [isDateVisible, setIsDateVisible] = useState(false);
  const [isTimeVisible, setIsTimeVisible] = useState(false);
  const [displayTime, setDisplayTime] = useState('01:00 AM');
  const [weekday, setWeekday] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  //    For notes   //
  const [notesValue, setNotesValue] = useState('');

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
      color: theme.colors.secondary,
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
      color: theme.colors.secondary,
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
    activityIndicator: {
      backgroundColor: theme.colors.backdrop,
      position: 'absolute',
      bottom: 0,
      top: 0,
      right: 0,
      left: 0,
      zIndex: 9998,
    },
  });

  return (
    <>
      {isLoading && <LoadingIndicator />}
      <SafeAreaView
        style={[
          mainContainer.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        {/* Header */}
        <Header headerText={headerValue} />
        {/* Delete appointment button */}
        {isIntentEdit && (
          <TouchableOpacity
            onPress={() => {
              setIsDialogVisible(true);
              setIsLoading(true);
            }}
          >
            <Text style={[styles.deleteApptBtn]}>
              <Icon name="delete" size={15}></Icon>
              {'\u00A0'} Delete{' '}
            </Text>
          </TouchableOpacity>
        )}
        {/* Dialogbox */}
        {isDialogVisible && (
          <ApptDialog
            appt={appointment}
            btnMessage={'Delete Appointment'}
            onClose={() => {
              setIsLoading(false);
              setIsDialogVisible(false);
            }}
          />
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
              onChangeText={text => setTitleValue(text)}
              value={titleValue}
            />

            {/* Appt Location dropdown */}
            <Text style={[styles.sectionHeader, { marginTop: 0 }]}>
              Select appointment location
            </Text>
            <View style={(styles.rowStyle, { zIndex: 9000 })}>
              <View style={{ flex: 1 }}>
                <DropDownPicker
                  placeholder={'🏥 Select hospital'}
                  placeholderStyle={styles.placeholderStyleCustom}
                  theme={dropDownTheme}
                  dropDownContainerStyle={{ position: 'relative', top: 0 }}
                  selectedItemContainerStyle={{
                    backgroundColor: '#BBDDD1',
                  }}
                  dropDownDirection="AUTO"
                  showTickIcon={true}
                  open={openLoc}
                  onOpen={onHospitalLocOpen}
                  value={valueLoc}
                  items={itemsLoc}
                  setOpen={setOpenLocation}
                  setValue={setValueLocation}
                  setItems={setItemsLocation}
                  autoScroll={true}
                  // listMode="MODAL" => Whole screen | "SCROLLVIEW" => Dropdown
                  listMode="SCROLLVIEW"
                  scrollViewProps={{ nestedScrollEnabled: true }}
                />
              </View>
              {valueLoc === '5' && (
                <View style={(styles.rowStyle, { zIndex: -1, marginTop: 10 })}>
                  <DropDownPicker
                    placeholder={'🛋️ Select Pickup Point'}
                    placeholderStyle={styles.placeholderStyleCustom}
                    theme={dropDownTheme}
                    dropDownContainerStyle={{ position: 'relative', top: 0 }}
                    selectedItemContainerStyle={{
                      backgroundColor: '#BBDDD1',
                    }}
                    dropDownDirection="AUTO"
                    showTickIcon={true}
                    open={openSpecificLoc}
                    onOpen={onSpecificLocOpen}
                    value={valueSpecificLoc}
                    items={itemsSpecificLoc}
                    setOpen={setOpenSpecificLocation}
                    setValue={setValueSpecificLocation}
                    setItems={setItemsSpecificLocation}
                    autoScroll={true}
                    // listMode="MODAL" => Whole screen | "SCROLLVIEW" => Dropdown
                    listMode="SCROLLVIEW"
                    scrollViewProps={{ nestedScrollEnabled: true }}
                  />
                </View>
              )}
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
                    console.debug(
                      'Line 684 date card:',
                      fullDateTime,
                      displayTime,
                    );

                    // Update data for sending
                    updateDateTime(weekday, day, month, year, displayTime);
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
                    <Text style={styles.timeText}>{displayTime}</Text>
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
              onChangeText={text => setNotesValue(text)}
              value={notesValue}
            />
          </View>
        </ScrollView>

        {/* Final submit button */}
        {!isKeyboardVisible && (
          <TouchableOpacity
            onPress={() => {
              // Date and time validation
              if (dateTimeNOW && isBefore(dateTime, dateTimeNOW)) {
                showToast('Please select a future date and time, not past.');
              } else {
                setIsLoading(true); // Start loading animation
                // Intent check
                if (isIntentEdit) {
                  updateDatabase(appointment.appointment_id, extractData());
                } else if (isIntentAdd) {
                  if (isTimeVisible && isDateVisible && valueLoc !== null) {
                    createAppointmentDatabase(extractData());
                  } else {
                    setIsLoading(false);
                    showToast(
                      '❗Please ensure date, time and hospitals are selected.',
                    );
                  }
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
