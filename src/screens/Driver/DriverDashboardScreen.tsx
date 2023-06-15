import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { mainContainer, bodyContainer, colors } from '../../styles/styles';
import Header from '../../components/Header';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

type ScreenList = {
  LoginScreen: undefined;
};

//Get: List of Request
const requestList = [
  {
    id: 1,
    user: 'John Doe',
    location: 'Tan Tock Seng Hospital-1',
    time: '08:00 am',
  },
  {
    id: 2,
    user: 'Jane Doe',
    location: 'Tan Tock Seng Hospital-2',
    time: '09:00 am',
  },
  {
    id: 3,
    user: 'Alex Doe',
    location: 'Tan Tock Seng Hospital-3',
    time: '10:00 am',
  },
  {
    id: 4,
    user: 'Felix Doe',
    location: 'Tan Tock Seng Hospital-4',
    time: '11:00 am',
  },
];

const DriverDashboardScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ScreenList>>();

  const theme = useTheme();

  const handleRequest = () => {};

  const handleLogout = () => {
    // Perform logout
    navigation.navigate('LoginScreen');
  };

  return (
    <>
      <SafeAreaView
        style={{
          ...mainContainer.container,
          backgroundColor: theme.colors.background,
        }}
      >
        {/* Header */}
        <Header headerText={'Driver Dashboard'} home={true} />
        {/* Logout Button */}
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutBtn}>Logout</Text>
        </TouchableOpacity>
        {/* Main Content */}
        <View style={bodyContainer.container}>
          <ScrollView>
            <Text
              style={{ ...styles.headerText, color: theme.colors.secondary }}
            >
              Request
            </Text>
            {/* Request Card */}
            <RequestCardRow req={requestList} handleRequest={handleRequest} />
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

interface Request {
  id: number;
  user: string;
  location: string;
  time: string;
}

interface RequestCardRowProps {
  req: Request[];
  handleRequest: () => void;
}

const RequestCardRow: React.FC<RequestCardRowProps> = ({
  req,
  handleRequest,
}) => {
  const theme = useTheme(); // use the theme hook

  return (
    <>
      {req.map(item => (
        <View
          key={item.id}
          style={{
            ...styles.cardContainer,
            backgroundColor: theme.colors.background,
          }}
        >
          <Text style={{ ...styles.cardText, color: theme.colors.secondary }}>
            Request #{item.id}
          </Text>
          <Text
            style={{
              ...styles.cardText,
              fontWeight: 'normal',
              color: theme.colors.secondary,
            }}
          >
            Request Time: {item.time}
          </Text>
          <Text
            style={{
              ...styles.cardText,
              fontWeight: 'normal',
              color: theme.colors.secondary,
            }}
          >
            Location: {item.location}
          </Text>
          <Text
            style={{
              ...styles.cardText,
              fontWeight: 'normal',
              color: theme.colors.secondary,
            }}
          >
            User: {item.user}
          </Text>
          <TouchableOpacity
            style={[styles.cardBtn, { backgroundColor: theme.colors.primary }]}
            onPress={handleRequest}
          >
            <Text style={styles.cardBtnText}>Accept Request</Text>
          </TouchableOpacity>
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 15,
    backgroundColor: colors.white,
    elevation: 5,
    padding: 10,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: colors.primary,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  cardBtn: {
    marginTop: 10,
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  cardBtnText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logoutBtn: {
    color: colors.white,
    borderRadius: 5,
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DriverDashboardScreen;
