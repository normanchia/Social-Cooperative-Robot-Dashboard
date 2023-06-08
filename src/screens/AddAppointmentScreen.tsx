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
import BottomNav from '../components/BottomNav';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import { showToast } from '../util/action';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RelaxView } from '../introduction_animation/scenes';
import DatePicker from 'react-native-date-picker';
import { FullWindowOverlay } from 'react-native-screens';

const AddAppointmentScreen: React.FC = () => {
  const mainScrollViewRef = useRef(null);
  //   useEffect(() => {
  //     // Scroll to a specific position on page load
  //     scrollToPosition();
  //   }, []);

  //   const scrollToPosition = () => {
  //     const scrollPosition = 100; // Specify the desired scroll position
  //     mainScrollViewRef.current?.scrollTo({ y: scrollPosition, animated: true });
  //   };

  const navigation = useNavigation<NavigationProp<Record<string, null>>>();
  const navigateBackToApptScreen = () => {
    printToast();
    navigation.navigate('AppointmentScreen', null);
  };

  //   For Dropdown //
  const [openLoc, setOpenLocation] = useState(false);
  const [valueLoc, setValueLocation] = useState(null);
  const [itemsLoc, setItemsLocation] = useState([
    { label: 'Alexandra Hospital', value: 'AH' },
    { label: 'AMK - Thye Hua Kwan Hospital', value: 'AMK' },
    { label: 'Bright Vision Community Hospital', value: 'BVCH' },
    { label: 'Changi General Hospital', value: 'CGH' },
    { label: 'Complex Medical Centre', value: 'CMC' },
    { label: 'Crawfurd Hospital', value: 'CH' },
    { label: 'Farrer Park Hospital', value: 'FPH' },
    { label: 'Gleneagles Hospital', value: 'GH' },
    { label: 'Institute of Metal Health/ Woodbridge Hospital', value: 'IMH' },
    { label: 'Jurong Community Hospital', value: 'JCH' },
    { label: 'Khoo Teck Puat Hospital', value: 'KTPH' },
    { label: "KK Women's and Children Hospital", value: 'KKWCH' },
    { label: 'Mount Alvernia Hospital', value: 'MAH' },
    { label: 'Mount Elizabeth Hospital', value: 'MEH' },
    { label: 'Mount Elizabeth Novena Hospital', value: 'MENH' },
    { label: 'National Heart Centre Singapore', value: 'NHCS' },
    { label: 'National University Hospital', value: 'NUH' },
    { label: 'Ng Teng Fong General Hospital', value: 'NTFGH' },
    { label: 'Outram Community Hospital', value: 'OCH' },
    { label: 'Parkway East Hospital', value: 'PEH' },
    { label: 'Raffles Hospital', value: 'RH' },
    { label: 'Ren Ci Community Hospital', value: 'RCCH' },
    { label: 'Sengkang Community Hospital', value: 'SCH' },
    { label: 'Sengkang General Hospital', value: 'SenGH' },
    { label: 'Singapore General Hospital', value: 'SgGH' },
    { label: 'St. Andrew Community Hospital', value: 'SACH' },
    { label: "St. Luke's Hospital", value: 'SLH' },
    { label: 'Tan Tock Seng Hospital', value: 'TTSH' },
    { label: 'Tan Tock Seng Hospital Rehabilitation Centre', value: 'TTSHRC' },
    { label: 'Tan Tock Seng Hospital Subacute Wards', value: 'TTSHSW' },
    { label: 'Thomson Medical Centre', value: 'TMC' },
    { label: 'Yishun Community Hospital', value: 'YCH' },
  ]);

  //    For datetime picker     //
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
  const [time, setDisplayTime] = useState('');
  const [weekday, setWeekday] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  //    For notes   //
  const [isNotesFocused, setIsNotesFocused] = useState(false);

  //    For debug   //
  const printToast = () => {
    showToast('🏠' + valueLoc + '📅' + dateTime);
  };

  return (
    <>
      <SafeAreaView style={mainContainer.container}>
        {/* Header */}
        <Header headerText={'        Add a new appointment!'} />
        <TouchableOpacity onPress={navigation.goBack}>
          <Text
            style={{
              color: colors.white,
              borderRadius: 5,
              position: 'absolute',
              bottom: 10,
              left: 10,
              paddingHorizontal: 5,
              paddingVertical: 5,
              fontSize: 25,
              fontWeight: 'bold',
            }}
          >
            🔙
          </Text>
        </TouchableOpacity>

        <ScrollView
        //   ref={mainScrollViewRef}
        //   contentContainerStyle={{ flexGrow: 1, paddingVertical: 20 }}
        //   onContentSizeChange={scrollToPosition}
        >
          {/* Main Content */}
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
              style={{ height: 50, fontSize: 15 }}
              placeholder="Click here to add additional title!"
              multiline
              textAlignVertical="top" // so ios and android same behavior
              maxLength={30} // 30 characters per line
              returnKeyType="done"
              onFocus={() => setIsNotesFocused(true)}
              onBlur={() => setIsNotesFocused(false)}
              // onChangeText={newText => setText(newText)}
              // defaultValue={text}
            />

            {/* Location dropdown */}
            <Text style={[styles.sectionHeader, { marginTop: 0 }]}>
              Select appointment location
            </Text>
            <View style={(styles.rowStyle, { zIndex: 9000, height: 60 })}>
              <View style={{ flex: 1 }}>
                <DropDownPicker
                  placeholder="🏥 Select hospital"
                  placeholderStyle={styles.placeholderStyleCustom}
                  dropDownContainerStyle={{}}
                  selectedItemContainerStyle={{ backgroundColor: '#C7E5E6' }}
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

            {/* Date Card */}
            <Text style={styles.sectionHeader}>Select date and time</Text>
            <View style={styles.rowStyle}>
              <TouchableOpacity
                //   style={{backgroundColor: dateTimeSelectorColor}}
                style={[
                  styles.dateTimeCardContainer,
                  isDateVisible && styles.backgroundColorSetWhite,
                ]}
                onPress={() => setOpenDate(true)}
              >
                {/* After date is selected, hide prompt and show date */}
                {!isDateVisible && (
                  <View style={styles.flexAlignMiddle}>
                    {/* <Text style={styles.pickDateTextComp}>📅</Text> */}
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
                  minimumDate={dateTime}
                  minuteInterval={5}
                  open={openDate}
                  date={dateTime}
                  onConfirm={date => {
                    setOpenDate(false);
                    setDate(date);
                    //   const dateString = date.toDateString();   // For date - unused atm
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
              style={{ height: 70 }}
              placeholder="Click here to add additional notes!"
              multiline
              textAlignVertical="top" // so ios and android same behavior
              maxLength={40} // 40 characters per line
              numberOfLines={3} // max 3 lines
              returnKeyType="done"
              onFocus={() => setIsNotesFocused(true)}
              onBlur={() => setIsNotesFocused(false)}
              // onChangeText={newText => setText(newText)}
              // defaultValue={text}
            />

            <Text style={styles.sectionHeader}>Other options uwu</Text>
            <Text>Room number? But a lot of options?</Text>
            <Text>temporary pending feedback</Text>
            <Text
              style={{
                height: 120,
                width: 20,
                borderWidth: 1,
                borderColor: '#4ef',
              }}
            >
              --------------------
            </Text>
          </View>
        </ScrollView>

        {/* Final submit button */}
        {!isNotesFocused && (
          <TouchableOpacity
            onPress={navigateBackToApptScreen}
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
              Add appointment!
            </Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </>
  );
};

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
    color: colors.black,
  },
  weekdayText: {
    textAlign: 'center',
    fontSize: 22,
  },
  dayText: {
    textAlign: 'center',
    fontSize: 40,
    color: colors.black,
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
    backgroundColor: colors.white,
    elevation: 5,
    padding: 5,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  calendarIcon: {
    textAlign: 'center',
    fontSize: 50,
    borderRadius: 30,
    padding: 10,
  },
  pickDateTextComp: {
    color: colors.black,
    fontSize: 50,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#1ef',
  },
  pickDateText: {
    color: colors.black,
    fontSize: 20,
    textAlign: 'center',
    // fontWeight: 'bold',
    // borderWidth: 1,
    // borderColor: '#f1e',
  },
  //   dateTimeCardTitle: {
  //     color: colors.white,
  //     fontSize: 25,
  //     flex: 1,
  //     flexDirection: 'row',
  //     justifyContent: 'center',
  //     alignSelf: 'center',
  //     alignContent: 'center',
  //     textAlign: 'center',
  //     textAlignVertical: 'center',
  //     borderWidth: 1,
  //     borderColor: '#f1e',
  //   },
  backgroundColorSetWhite: { backgroundColor: colors.white },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'rgba(245,245,245,1.0)',
    marginTop: 15,
    marginLeft: -20,
    marginRight: -20,
    marginBottom: 5,
  },

  placeholderStyleCustom: {
    borderRadius: 10,
    backgroundColor: colors.white,
    padding: 10,
  },

  rowStyle: {
    flexDirection: 'row',
    // marginTop: 10,
    alignContent: 'space-around',
    // borderWidth: 1,
    // borderColor: '#f1e',
  },

  buttonDT: { backgroundColor: colors.primary, zIndex: 1000 },
});

export default AddAppointmentScreen;
