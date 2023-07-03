import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from 'react';
import { Text, StyleSheet, View, Platform } from 'react-native';
import { Button, Dialog, Portal, useTheme } from 'react-native-paper';
import { showToast } from '../util/action';
import { Linking } from 'react-native';

interface Appointment {
  appointment_id: number;
  hospital_id: number;
  hospital_name: string;
  appointment_time: number;
  appointment_date: string;
  additional_note: string;
  appointment_title: string;
}

interface ApptDialogProps {
  appt: Appointment | null;
  btnMessage: string;
  onClose: () => void;
}

const ApptDialog: React.FC<ApptDialogProps> = ({
  appt,
  btnMessage,
  onClose,
}) => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [isVisible, setVisible] = useState(false);

  // Variables
  const btnEditText = 'Edit Appointment';
  const btnDeleteText = 'Delete Appointment';
  const btnTimeZoneText = 'Change Timezone';

  const hideDialog = () => {
    setVisible(false);
    onClose();
  };

  const deleteAppointmentDatabase = async (apptID: number) => {
    try {
      const response = await axios.delete(
        `http://10.0.2.2:5000/appointment/${apptID}`,
      );
      if (response.status === 200) {
        showToast('Appointment deleted!');
      } else {
        showToast('Error deleting appointment, please try again later.');
      }
    } catch (error) {
      console.log('Error deleting appointment:', error);
    }
  };

  const styles = StyleSheet.create({
    dialogStlye: {
      backgroundColor: theme.colors.background,
      borderColor: theme.dark ? theme.colors.onBackground : 'transparent',
      borderWidth: 5,
    },
    headerTxt: {
      color: theme.colors.secondary,
      fontSize: 30,
    },
    hospitalTxt: {
      color: theme.colors.secondary,
      fontSize: 22,
      fontWeight: 'bold',
    },
    dateTimeTxt: { color: theme.colors.secondary, fontSize: 20 },
    notesTxt: {
      color: theme.dark ? '#F49ABE' : '#121',
      fontSize: 16,
      fontWeight: 'bold',
      fontStyle: 'italic',
    },
    actionbuttonStyle: {
      color: theme.colors.primary,
      fontSize: 18,
      textDecorationLine: 'underline',
    },
  });

  return (
    <Portal>
      <Dialog
        visible={true}
        onDismiss={hideDialog}
        dismissable={true}
        dismissableBackButton={true}
        style={styles.dialogStlye}
      >
        {/* Show Dialog if appt is true */}
        {btnMessage === btnEditText ? (
          <>
            <Dialog.Title>
              <Text style={[styles.headerTxt]}>{appt?.appointment_title}</Text>
            </Dialog.Title>
            <Dialog.Content>
              <Text style={styles.hospitalTxt}>{appt?.hospital_name}</Text>
              <Text style={styles.dateTimeTxt}>{appt?.appointment_date}</Text>
              <Text style={styles.dateTimeTxt}>{appt?.appointment_time}</Text>
              <Text style={styles.notesTxt}>{appt?.additional_note}</Text>
            </Dialog.Content>
          </>
        ) : btnMessage === btnDeleteText ? (
          // Show dialog if it's delete prompt
          <>
            <Dialog.Title>
              <Text>Are you sure you want to delete this appointment?</Text>
            </Dialog.Title>
            <Dialog.Content>
              <Text style={styles.hospitalTxt}>{appt?.hospital_name}</Text>
              <Text style={styles.dateTimeTxt}>{appt?.appointment_date}</Text>
              <Text style={styles.dateTimeTxt}>{appt?.appointment_time}</Text>
              <Text style={styles.notesTxt}>{appt?.additional_note}</Text>
            </Dialog.Content>
          </>
        ) : btnMessage === btnTimeZoneText ? (
          <>
            <Dialog.Title>
              <Text>Your timezone is not based in Singapore</Text>
            </Dialog.Title>
            <Dialog.Content>
              <Text>
                This application is made for use in Singapore only. Please
                change your timezone to Singapore, GMT+8 before continuing using
                the application.
              </Text>
            </Dialog.Content>
          </>
        ) : null}

        <Dialog.Actions>
          <Button
            onPress={() => {
              hideDialog();
              if (appt) {
                if (btnMessage === btnEditText) {
                  navigation.navigate('AddAppointmentScreen', {
                    appointment: appt,
                    screenIntent: 'editAppointment',
                  });
                } else if (btnMessage === btnDeleteText) {
                  console.log('appt id:', appt.appointment_id);
                  deleteAppointmentDatabase(appt.appointment_id);
                  navigation.navigate('AddAppointmentScreen');
                  navigation.navigate('AppointmentScreen');
                }
              } else {
                if (btnMessage === btnTimeZoneText) {
                  Platform.OS === 'ios'
                    ? Linking.openURL(
                        'App-Prefs:root=General&path=DATE_AND_TIME',
                      )
                    : Linking.sendIntent('android.settings.DATE_SETTINGS');
                } else {
                  console.log('Missing appt data');
                }
              }
            }}
          >
            <Text
              style={[
                styles.actionbuttonStyle,
                btnMessage === 'Delete Appointment' && {
                  color: theme.colors.error,
                },
              ]}
            >
              {btnMessage}
            </Text>
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default ApptDialog;
