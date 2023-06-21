import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { mainContainer, bodyContainer, colors } from '../../styles/styles';
import Header from '../../components/Header';
import { useTheme } from 'react-native-paper';
import AppointmentScreen from '../AppointmentScreen';

// items
import { List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import { ListItem } from '@rneui/themed';
import { Image } from 'react-native';
import { memo } from 'react';
import { ScrollView } from 'react-native';

const AccordionItem: React.FC<{
  expanded: boolean;
  toggleExpanded: () => void;
}> = memo(({ expanded, toggleExpanded }) => {
  return (
    <List.Accordion
      title={
        <Text
          style={[
            styles.accordionTitle,
            expanded && styles.expandedAccordionTitle,
          ]}
        >
          How to add a new appointment
        </Text>}
      expanded={expanded}
      onPress={toggleExpanded}
      right={(props) =>
        expanded ? (
          <Icon name="arrow-drop-up" size={40} color="#0000FF" {...props} />
        ) : (
          <Icon name="arrow-drop-down" size={40} color="black" {...props} />
        )
      }
    >
      {expanded && (

        <ScrollView style={styles.contentContainer}>
          <List.Item
            title="Step 1" titleStyle={styles.accordionContentTitle}
            description={<Text style={styles.descriptionText}>
              On the appointment page, click on the "Add new Appt" button.
            </Text>}
          />
          <View style={styles.imageContainer}>
            <Image
              source={require('/Users/Shumin/Documents/GitHub/ITP3111/src/assets/userguide/go_add_appt.png')}
              style={styles.expandedImage}
            />
          </View>
          <List.Item
            title="Step 2" titleStyle={styles.accordionContentTitle}
            description={<Text style={styles.descriptionText}>
              Click on the first box shown below to enter the name of your appointment.
            </Text>}
          />
          <List.Item
            title="Step 3" titleStyle={styles.accordionContentTitle}
            description={<Text style={styles.descriptionText}>
              Next, click on the second box to choose the location of your appointment.
            </Text>}
          />
          <View style={styles.imageContainer}>
            <Image
              source={require('/Users/Shumin/Documents/GitHub/ITP3111/src/assets/userguide/go_add_appt1.png')}
              style={styles.expandedImage}
            />
          </View>
          <List.Item
            title="Step 4" titleStyle={styles.accordionContentTitle}
            description={<Text style={styles.descriptionText}>
              Click on "Add Date" to choose the date and "Add Time" to choose the time.
            </Text>}
          />
          <View style={styles.imageContainer}>
            <Image
              source={require('/Users/Shumin/Documents/GitHub/ITP3111/src/assets/userguide/go_add_appt2.png')}
              style={styles.expandedImage}
            />
          </View>
          <List.Item
            title="Step 5 (optional)" titleStyle={styles.accordionContentTitle}
            description={<Text style={styles.descriptionText}>
              Click on the box below to add a note on this appointment.
            </Text>}
          />
          <View style={styles.imageContainer}>
            <Image
              source={require('/Users/Shumin/Documents/GitHub/ITP3111/src/assets/userguide/go_add_appt3.png')}
              style={styles.expandedImage}
            />
          </View>
          <List.Item
            title="Step 6" titleStyle={styles.accordionContentTitle}
            description={<Text style={styles.descriptionText}>
              Click on the "Add appointment!" button and you are done!.
            </Text>}
          />
        </ScrollView>
      )}
    </List.Accordion>
  );
});

const AppointmentHelpScreen: React.FC = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState(true);

  const toggleExpanded = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  return (
    <>
      <SafeAreaView
        style={{
          ...mainContainer.container,
          backgroundColor: theme.colors.background,
        }}
      >
        <Header headerText={'Appointment Help'} />
        <View style={{ ...bodyContainer.container }}>
          <Text style={{ ...styles.headerText, color: theme.colors.secondary }}>
            FAQ on Appointment
          </Text>
          <AccordionItem expanded={expanded} toggleExpanded={toggleExpanded} />
        </View>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  accordionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  accordionContentTitle: {
    marginTop: -10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  expandedAccordionTitle: {
    color: '#0000FF',
  },
  expandedImage: {
    // width: 300,
    // height: 200,
    resizeMode: 'contain',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionText: {
    fontSize: 18,
    lineHeight: 22,
  },
  contentContainer: {
    maxHeight: 500,
  },


});

export default AppointmentHelpScreen;
