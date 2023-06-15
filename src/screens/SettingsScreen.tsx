import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import { mainContainer, bodyContainer } from '../styles/styles';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const settingsOptions = [
  { text: 'Account Information', iconName: 'user' },
  { text: 'Preferences', iconName: 'cog' },
  { text: 'Notifications', iconName: 'bell' },
  { text: 'Help & Support', iconName: 'question-circle' },
  { text: 'Logout', iconName: 'sign-out' },
];

const numColumns = 2;
const size = Dimensions.get('window').width / numColumns;

const SettingsScreen: React.FC = () => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>{item.text}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <SafeAreaView style={mainContainer.container}>
        {/* Header */}
        <Header headerText={'Settings'} />
        {/* Main Content */}
        <View style={bodyContainer.container}>
          <FlatList
            data={settingsOptions}
            renderItem={renderItem}
            keyExtractor={item => item.text}
            numColumns={numColumns}
            key={numColumns}
          />
        </View>
      </SafeAreaView>
      {/* Bottom Nav */}
      <BottomNav activeRoute={'SettingsScreen'} />
    </>
  );
};

export default SettingsScreen;
