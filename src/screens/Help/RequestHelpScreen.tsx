import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { mainContainer, bodyContainer, colors } from '../../styles/styles';
import Header from '../../components/Header';
import { useTheme } from 'react-native-paper';
import { Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const RequestHelpScreen: React.FC = () => {
  const theme = useTheme(); // use the theme hook
  return (
    <>
      <SafeAreaView
        style={{
          ...mainContainer.container,
          backgroundColor: theme.colors.background,
        }}
      >
        {/* Header */}
        <Header headerText={'Request Help'} />
        <ScrollView>
          {/* Main Content */}
          <View style={{ ...bodyContainer.container }}>
            <Text style={{ ...styles.headerText, color: theme.colors.secondary }}>
              Going somewhere without an appointment?
            </Text>
            <Text style={{ ...styles.subheaderText, color: theme.colors.secondary }}>
              We got you!
            </Text>
            <Text style={{ ...styles.descriptionText, color: theme.colors.secondary }}>
              Start by clicking on <Text style={styles.boldText}>"Request Robot"</Text>.
            </Text>
            <Image
              source={require('../../assets/userguide/request_robot.png')}
              style={styles.image}
            />
            <Text style={{ ...styles.descriptionText, color: theme.colors.secondary }}>
            On the Request Robot page, you will be able to see the stations around you and the number of robots available in each station.
            </Text>
            <Image
              source={require('../../assets/userguide/request_robot1.png')}
              style={styles.image}
            />
            <Text style={{ ...styles.subheaderText, color: theme.colors.secondary }}>
              To request for a robot
            </Text>
            <Text style={{ ...styles.descriptionText, color: theme.colors.secondary }}>
              Choose a station close to you with availble robot and click on <Text style={styles.boldText}>"Call Robot"</Text>.
            </Text>
            <Image
              source={require('../../assets/userguide/request_robot2.png')}
              style={styles.imageMed}
            />
            <Text style={{ ...styles.descriptionText, color: theme.colors.secondary }}>
              A pop up will be shown for you to select your destination. Click on the <Text style={styles.boldText}>box</Text> below to change your destination.
            </Text>
            <Image
              source={require('../../assets/userguide/request_robot3.png')}
              style={styles.imageMed}
            />
            <Text style={{ ...styles.descriptionText, color: theme.colors.secondary }}>
              Once you've selected your destination. Click on <Text style={styles.boldText}>"Save"</Text> to proceed with the request.
            </Text>
            <Image
              source={require('../../assets/userguide/request_robot4.png')}
              style={styles.imageMed}
            />
            <Text style={{ ...styles.descriptionText, color: theme.colors.secondary }}>
              A successful message will be shown to you. Click on <Text style={styles.boldText}>"OK"</Text> to go back to the request page.
            </Text>
            <Image
              source={require('../../assets/userguide/request_robot5.png')}
              style={styles.imageSmall}
            />
            <Text style={{ ...styles.subheaderText, color: theme.colors.secondary }}>
              After completing the trip
            </Text>
            <Text style={{ ...styles.descriptionText, color: theme.colors.secondary }}>
              Under Current Request, click on <Text style={styles.boldText}>"Complete"</Text> to end your journey.
            </Text>
            <Image
              source={require('../../assets/userguide/request_robot6.png')}
              style={styles.imageSmallest}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  subheaderText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  descriptionText: {
    fontSize: 20,
    fontWeight: 'normal',
    marginTop: 10,
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  image: {
    width: 300,
    height: 600,
    alignSelf: 'center',
  },
  imageMed: {
    width: 320,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  imageSmall: {
    width: 320,
    height: 200,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  imageSmallest: {
    width: 320,
    height: 160,
    alignSelf: 'center',
    resizeMode: 'contain',
  },

});

export default RequestHelpScreen;
