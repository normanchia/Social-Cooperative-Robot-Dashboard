import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

  const hideDialog = () => {
    setVisible(false);
    onClose();
  };

  return (
    <Portal>
      <Dialog
        // theme={{ colors: { primary: useTheme().colors.backdrop } }}
        visible={true}
        onDismiss={hideDialog}
        dismissable={true}
        dismissableBackButton={true}
      >
        {/* Show Dialog if appt is true */}
        {btnMessage === 'Edit Appointment' ? (
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
        ) : (
          // Show dialog if it's delete prompt
          <>
            <Dialog.Title>
              <Text>Are you sure you want to delete this appointment?</Text>
            </Dialog.Title>
            <Dialog.Content>
              <Text>
                Tap outside this box or press the back button if you do not wish
                to delete the appointment. Else, please tap the "DELETE" button.
              </Text>
            </Dialog.Content>
          </>
        )}

        <Dialog.Actions>
          <Button
            onPress={() => {
              hideDialog();
              if (appt) {
                btnMessage === 'Edit Appointment' &&
                  navigation.navigate('AddAppointmentScreen', {
                    appointment: appt,
                    screenIntent: 'editAppointment',
                  });
              } else {
                console.log('Yo you wanted this deleted.'),
                  navigation.navigate('AddAppointmentScreen', {
                    screenIntent: 'deleteAppointment',
                  });
              }
            }}
          >
            {btnMessage}
          </Button>
          {/* <Button onPress={hideDialog}>Delete Appointment</Button> */}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  headerTxt: {
    color: '#000',
    fontSize: 30,
  },
  hospitalTxt: { color: '#000', fontSize: 22, fontWeight: 'bold' },
  dateTimeTxt: { color: '#000', fontSize: 20 },
  notesTxt: {
    color: '#121',
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
});

export default ApptDialog;
