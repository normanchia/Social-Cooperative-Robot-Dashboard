import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Button,
  Dialog,
  IconButton,
  Portal,
  useTheme,
} from 'react-native-paper';
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
  onClose: () => void;
}

const ApptDialog: React.FC<ApptDialogProps> = ({ appt, onClose }) => {
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
        <Dialog.Title>
          <Text style={[styles.headerTxt]}>{appt?.appointment_title}</Text>
        </Dialog.Title>
        <Dialog.Content>
          {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={[styles.headerTxt]}>{appt?.appointment_title}</Text>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Icon.Button
                name="delete"
                color={'#b01515'}
                backgroundColor={'transparent'}
                borderRadius={20}
                style={{
                  padding: 4,
                  paddingLeft: 9,
                  paddingRight: 0,
                  //   borderWidth: 1,
                  //   borderColor: '#000',
                }}
                size={30}
                onPress={() => console.log('pressed del uwu')}
              />
            </View>
          </View> */}
          <Text style={styles.hospitalTxt}>{appt?.hospital_name}</Text>
          <Text style={styles.dateTimeTxt}>{appt?.appointment_date}</Text>
          <Text style={styles.dateTimeTxt}>{appt?.appointment_time}</Text>
          <Text style={styles.notesTxt}>{appt?.additional_note}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              hideDialog();
              if (appt) {
                navigation.navigate('AddAppointmentScreen', {
                  appointment: appt,
                  screenIntent: 'editAppointment',
                });
              }
            }}
          >
            Edit Appointment
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
