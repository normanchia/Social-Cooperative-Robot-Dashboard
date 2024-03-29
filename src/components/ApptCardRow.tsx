import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import axios from 'axios';

interface Appointment {
  appointment_id: number;
  hospital_id: number;
  appointment_time: number;
  appointment_date: string;
  appointment_title: string;
}

interface ApptCardRowProps {
  appt: Appointment[];
}

interface HospitalData {
  postal_code: string;
  hospital_name: string;
}

const ApptCardRow: React.FC<ApptCardRowProps> = ({ appt }) => {
  //State
  const [hospitalData, setHospitalData] = useState<HospitalData | null>(null);

  //Variables
  const theme = useTheme(); // use the theme hook

  // Handlers
  // const convertTime = (time: number) => {
  //   const appointmentTime = new Date(time * 1000);
  //   appointmentTime.setUTCHours(appointmentTime.getUTCHours() + 8); // change to GMT +8
  //   const hours = appointmentTime.getHours();
  //   const minutes = appointmentTime.getMinutes();
  //   const period = hours >= 12 ? 'pm' : 'am';
  //   const formattedHours = hours % 12 || 12;
  //   const formattedMinutes = minutes.toString().padStart(2, '0');
  //   const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;
  //   return formattedTime;
  // };

  function convertTime(time: number) {
    const hours = Math.floor(time / 3600); // Get the hours portion
    const minutes = Math.floor((time % 3600) / 60); // Get the minutes portion
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 0 to 12

    // Pad the minutes with leading zero if necessary
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  // UseEffect Hook
  useEffect(() => {
    const getHospitalData = async () => {
      try {
        const response = await axios.get(
          `https://itp3111.as.r.appspot.com/hospital/${appt[0].hospital_id}`,
        );
        if (response.status === 200) {
          setHospitalData(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (appt.length > 0) {
      getHospitalData();
    }
  }, [appt]);

  return (
    <>
      {appt.map(item => (
        <View key={item.appointment_id}>
          <Text style={{ ...styles.cardText, color: theme.colors.secondary }}>
            {item.appointment_title}
          </Text>
          {hospitalData && (
            <Text
              style={{
                ...styles.cardText,
                fontWeight: 'normal',
                color: theme.colors.secondary,
              }}
            >
              {hospitalData.hospital_name} {hospitalData.postal_code}
            </Text>
          )}
          <Text style={{ ...styles.cardText, color: theme.colors.secondary }}>
            {convertTime(item.appointment_time)}
          </Text>
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  cardText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 5,
  },
});

export default ApptCardRow;
