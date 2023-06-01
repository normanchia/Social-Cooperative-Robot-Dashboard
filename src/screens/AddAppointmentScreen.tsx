// Docs on dropdown picker: https://hossein-zare.github.io/react-native-dropdown-picker-website/docs/rules
// Docs on dateTime picker: https://github.com/henninghall/react-native-date-picker#example-1-modal

import React, { Children, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Button,
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

const AddAppointmentScreen: React.FC = () => {
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
  const [dateButtonTitle, setDateButtonTitle] = useState('📅 Set Date');
  const [timeButtonTitle, setTimeButtonTitle] = useState('⌚ Set Time');

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

        {/* Main Content */}
        <View
          style={{
            margin: 20,
            flexDirection: 'column',
          }}
        >
          {/* Location dropdown */}
          <View style={(styles.rowStyle, { zIndex: 9000 })}>
            <View style={{ flex: 5 }}>
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
              />
            </View>
          </View>

          {/* Select AM/PM time */}
          <View style={styles.rowStyle}>
            <View style={{ flex: 5 }}>
              <Button
                color={colors.primary}
                title={dateButtonTitle}
                onPress={() => setOpenDate(true)}
              />
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
                  setDateButtonTitle(date.toDateString());
                }}
                onCancel={() => {
                  setOpenDate(false);
                }}
              />
            </View>
            <View style={{ flex: 1 }}></View>
            <View style={{ flex: 5 }}>
              <Button
                color={colors.primary}
                title={timeButtonTitle}
                onPress={() => setOpenTime(true)}
              />
              <DatePicker
                modal
                mode="time"
                minuteInterval={5}
                open={openTime}
                date={dateTime}
                onConfirm={date => {
                  setOpenTime(false);
                  setDate(date);
                  setTimeButtonTitle(date.toLocaleTimeString());
                }}
                onCancel={() => {
                  setOpenTime(false);
                }}
              />
            </View>
          </View>

          <Text>Room number? But a lot of options?</Text>
          <Text>temporary pending feedback</Text>
        </View>

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
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  placeholderStyleCustom: {
    borderRadius: 10,
    backgroundColor: colors.white,
    padding: 10,
  },

  rowStyle: {
    flexDirection: 'row',
    marginTop: 60,
    alignContent: 'space-around',
  },

  buttonDT: { backgroundColor: colors.primary, zIndex: 1000 },
});

export default AddAppointmentScreen;
