import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { showToast } from '../util/action';
import { mainContainer, bodyContainer, colors } from '../styles/styles';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import EditFavouritesModal from '../components/EditFavoritesModal';
import LocationCardRow from '../components/LocationCardRow';

//Get: User Recent Location
const recentLocation = [
  {
    id: 1,
    name: 'Blk 223 Bus Stop',
    distance: '300m away',
  },
  {
    id: 2,
    name: 'Blk 220 Garden',
    distance: '200m away',
  },
];

//Get: User Favourite Location
const favouriteLocation = [
  {
    id: 1,
    name: 'Blk 223 Bus Stop',
    distance: '300m away',
  },
  {
    id: 2,
    name: 'Amk CC',
    distance: '500m away',
  },
];

// Get: All Location
const allLocations = [
  {
    id: 1,
    name: 'Blk 444 Bus Stop',
  },
  {
    id: 2,
    name: 'Blk 220 Garden',
  },
  {
    id: 3,
    name: 'Blk 223 Bus Stop',
  },
  {
    id: 4,
    name: 'Amk CC',
  },
];

interface Location {
  id: number;
  name: string;
}

const CallScreen: React.FC = () => {
  // States
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Handlers
  const callRobotHandler = () => {
    showToast('Calling Robot');
  };

  const toggleEditModal = () => {
    setShowEditModal(!showEditModal);
  };

  const seacrhTextHandler = (text: string) => {
    setSearchText(text);
    setDropdownVisible(text !== '');
    const filteredLocations = allLocations.filter(location =>
      location.name.toLowerCase().includes(text.toLowerCase()),
    );
    setSearchResults(filteredLocations);
  };

  const searchResultHandler = (item: Location) => {
    setSelectedLocation(item);
    setSearchText(item.name);
    setDropdownVisible(false);
  };

  return (
    <>
      <SafeAreaView style={mainContainer.container}>
        {/* Header */}
        <Header headerText={'Where would you like to go ?'} />
        {/* Main Content */}
        <View style={bodyContainer.container}>
        {showEditModal && <EditFavouritesModal onSave={toggleEditModal} />}
          {/* Search bar */}
          <TextInput
            style={styles.searchBar}
            placeholder="Enter Destination"
            value={searchText}
            onChangeText={seacrhTextHandler}
          />
          {/* Search Results */}
          {dropdownVisible && (
            <View style={styles.dropdownContainer}>
              <FlatList
                data={searchResults}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => searchResultHandler(item)}
                  >
                    <Text style={styles.dropdownText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
          {/* Recent */}
          <View style={styles.cardContainer}>
            <Text style={styles.cardHeading}>Recent</Text>
            <View style={styles.border} />
            <LocationCardRow
              location={recentLocation}
              callRobotHandler={callRobotHandler}
            />
          </View>
          {/* Favourite */}
          <View style={styles.cardContainer}>
            <View style={styles.headingRow}>
              <View style={styles.headingTextContainer}>
                <Text style={styles.cardHeading}>Favourite</Text>
              </View>
              <TouchableOpacity onPress={toggleEditModal}>
                <Icon size={30} name="edit" color={colors.black} />
              </TouchableOpacity>
            </View>
            <View style={styles.border} />
            <LocationCardRow
              location={favouriteLocation}
              callRobotHandler={callRobotHandler}
            />
          </View>
        </View>
      </SafeAreaView>
      {/* Bottom Nav */}
      <BottomNav activeRoute={'CallScreen'} />
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
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  headingTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  cardHeading: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    paddingBottom: 10,
  },
  searchBar: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray,
    paddingLeft: 10,
    marginBottom: 10,
  },
  dropdownContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: colors.white,
    borderRadius: 10,
    elevation: 5,
    paddingHorizontal: 10,
  },
  dropdownItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CallScreen;
