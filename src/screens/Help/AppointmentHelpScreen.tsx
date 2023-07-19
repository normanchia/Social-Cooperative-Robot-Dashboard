import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { mainContainer, bodyContainer, colors } from '../../styles/styles';
import Header from '../../components/Header';
import { useTheme } from 'react-native-paper';
import AppointmentScreen from '../AppointmentScreen';

import { List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Image } from 'react-native';
import { memo } from 'react';
import { ScrollView } from 'react-native';

// data
const AccordionItem1: React.FC<{
  expanded: boolean;
  toggleExpanded: () => void;
}> = memo(({ expanded, toggleExpanded }) => {
  const theme = useTheme();
  return (
    <View style={styles.accordionWrapper}>
      <List.Accordion
        title={
          <Text
            style={[
              styles.accordionTitle,
              { color: theme.colors.secondary },
              expanded && { color: theme.colors.primary },,
            ]}
          >
            How to add a new appointment
          </Text>}
        expanded={expanded}
        onPress={toggleExpanded}
        right={(props) =>
          expanded ? (
            <Icon name="arrow-drop-up" size={40} color={theme.colors.primary} {...props} />
          ) : (
            <Icon name="arrow-drop-down" size={40} color={theme.colors.secondary} {...props} />
          )
        }
        style={styles.listAccordion}
      >
        {expanded && (

          <ScrollView style={styles.contentContainer}>
            <List.Item
              title="Step 1" titleStyle={{ ...styles.accordionContentTitle, color: theme.colors.secondary }}
              description={<Text style={{ ...styles.descriptionText, color: theme.colors.secondary }}>
                On the appointment page, click on the "Add new Appt" button.
              </Text>}
            />
            <View style={styles.imageContainer}>
              <Image
                source={require('../../assets/userguide/go_add_appt.png')}
                style={styles.expandedImage}
              />
            </View>
            <List.Item
              title="Step 2" titleStyle={{ ...styles.accordionContentTitle, color: theme.colors.secondary }}
              description={<Text style={{ ...styles.descriptionText, color: theme.colors.secondary }}>
                Click on the first box shown below to enter the name of your appointment.
              </Text>}
            />
            <List.Item
              title="Step 3" titleStyle={{ ...styles.accordionContentTitle, color: theme.colors.secondary }}
              description={<Text style={{ ...styles.descriptionText, color: theme.colors.secondary }}>
                Next, click on the second box to choose the location of your appointment.
              </Text>}
            />
            <View style={styles.imageContainer}>
              <Image
                source={require('../../assets/userguide/go_add_appt1.png')}
                style={styles.expandedImage}
              />
            </View>
            <List.Item
              title="Step 4" titleStyle={{ ...styles.accordionContentTitle, color: theme.colors.secondary }}
              description={<Text style={{ ...styles.descriptionText, color: theme.colors.secondary }}>
                Click on "Add Date" to choose the date and "Add Time" to choose the time.
              </Text>}
            />
            <View style={styles.imageContainer}>
              <Image
                source={require('../../assets/userguide/go_add_appt2.png')}
                style={styles.expandedImage}
              />
            </View>
            <List.Item
              title="Step 5 (optional)" titleStyle={{ ...styles.accordionContentTitle, color: theme.colors.secondary }}
              description={<Text style={{ ...styles.descriptionText, color: theme.colors.secondary }}>
                Click on the box below to add a note on this appointment.
              </Text>}
            />
            <View style={styles.imageContainer}>
              <Image
                source={require('../../assets/userguide/go_add_appt3.png')}
                style={styles.expandedImage}
              />
            </View>
            <List.Item
              title="Step 6" titleStyle={{ ...styles.accordionContentTitle, color: theme.colors.secondary }}
              description={<Text style={{ ...styles.descriptionText, color: theme.colors.secondary }}>
                Click on the "Add appointment!" button and you are done!
              </Text>}
            />
          </ScrollView>
        )}
      </List.Accordion>
    </View>
  );
});

const AccordionItem2: React.FC<{
  expanded: boolean;
  toggleExpanded: () => void;
}> = memo(({ expanded, toggleExpanded }) => {
  const theme = useTheme();
  return (
    <View style={styles.accordionWrapper}>
    <List.Accordion
      title={
        <Text
          style={[
            styles.accordionTitle,
            { color: theme.colors.secondary },
            expanded && { color: theme.colors.primary },,
          ]}
        >
          How to edit an appointment
        </Text>}
      expanded={expanded}
      onPress={toggleExpanded}
      right={(props) =>
        expanded ? (
          <Icon name="arrow-drop-up" size={40} color={theme.colors.primary} {...props} />
        ) : (
          <Icon name="arrow-drop-down" size={40} color={theme.colors.secondary} {...props} />
        )
      }
      style={styles.listAccordion}
    >
      {expanded && (

        <ScrollView style={styles.contentContainer}>
          <List.Item
            title="Step 1" titleStyle={{ ...styles.accordionContentTitle, color: theme.colors.secondary }}
            description={<Text style={{ ...styles.descriptionText, color: theme.colors.secondary }}>
              Click on the appointment you wish to change.
            </Text>}
          />
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/userguide/change_appt.png')}
              style={styles.expandedImage}
            />
          </View>
          <List.Item
            title="" titleStyle={styles.accordionContentTitle}
            description={<Text style={{ ...styles.descriptionText, color: theme.colors.secondary }}>
              A pop up will appear on your screen as shown below.
            </Text>}
          />
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/userguide/change_appt1.png')}
              style={styles.expandedImage}
            />
          </View>
          <List.Item
            title="Step 2" titleStyle={{ ...styles.accordionContentTitle, color: theme.colors.secondary }}
            description={<Text style={{ ...styles.descriptionText, color: theme.colors.secondary }}>
              Click on “Edit appointment” to proceed and make the changes needed.
            </Text>}
          />
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/userguide/change_appt2.png')}
              style={styles.expandedImage}
            />
          </View>
          <List.Item
            title="Step 3" titleStyle={{ ...styles.accordionContentTitle, color: theme.colors.secondary }}
            description={<Text style={{ ...styles.descriptionText, color: theme.colors.secondary }}>
              Click on "Update" to apply the changes.
            </Text>}
          />
          <View style={styles.customListItem}>
            <Text style={{ ...styles.descriptionText, color: theme.colors.secondary }} >
              Upon successful update, a message will be shown at the bottom of the screen for a few seconds.
            </Text>
          </View>
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/userguide/change_appt3.png')}
              style={styles.expandedImage}
            />
          </View>
        </ScrollView>
      )}
    </List.Accordion>
    </View>
  );
});

const AppointmentHelpScreen: React.FC = () => {
  const theme = useTheme();
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(0);

  const toggleExpanded = (index: number) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
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
          <AccordionItem1 expanded={expandedIndex === 0} toggleExpanded={() => toggleExpanded(0)} />
          <AccordionItem2 expanded={expandedIndex === 1} toggleExpanded={() => toggleExpanded(1)} />
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
  accordionWrapper: {
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    elevation: 8,
    backgroundColor: '#FFF', // Add background color if needed
    borderRadius: 8, // Add border radius if needed
    marginVertical: 5, // Add margin if needed
  },
  listAccordion: {
    backgroundColor: 'transparent', // Ensure the List.Accordion background is transparent
  },
  accordionContentTitle: {
    marginTop: -10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  expandedImage: {
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
  customListItem: {
    padding: 16,
    marginTop: -30,
    marginBottom: 10,
    borderRadius: 8,
  },
  contentContainer: {
    maxHeight: 500,
  },


});

export default AppointmentHelpScreen;
