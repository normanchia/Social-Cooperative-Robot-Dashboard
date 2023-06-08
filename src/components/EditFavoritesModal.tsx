import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';

import { colors } from '../styles/styles';

const windowHeight = Dimensions.get('window').height;

// Props Types
interface Location {
  id: number;
  name: string;
}

interface EditFavouritesModalProps {
  onSave: () => void;
}

const EditFavouritesModal: React.FC<EditFavouritesModalProps> = ({
  onSave,
}) => {
  // State
  const [locations, setLocations] = useState<Location[]>([
    { id: 1, name: 'Location 1' },
    { id: 2, name: 'Location 2' },
  ]);

  // Handlers
  const deleteBtnHnadler = (id: number) => {
    const updatedLocations = locations.filter(location => location.id !== id);
    setLocations(updatedLocations);
  };

  const saveBtnHandler = () => {
    // Perform save logic here
    onSave();
  };

  const renderRow = ({ item }: { item: Location }) => (
    <View style={styles.row}>
      <Text style={styles.rowText}>{item.name}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteBtnHnadler(item.id)}
      >
        <Text style={styles.deleteButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>Edit Favourites</Text>
      <FlatList
        data={locations}
        renderItem={renderRow}
        keyExtractor={item => item.id.toString()}
      />
      <TouchableOpacity style={styles.saveButton} onPress={saveBtnHandler}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: windowHeight * 0.8,
    backgroundColor: colors.white,
    borderRadius: 15,
    elevation: 10,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headingText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  rowText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: colors.red,
    borderRadius: 10,
    padding: 7,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditFavouritesModal;