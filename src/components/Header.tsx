import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from 'react-native-paper';

interface HeaderProps {
  home?: boolean;
  headerText: string;
}

const Header: React.FC<HeaderProps> = ({ home = false, headerText }) => {
  const navigation = useNavigation();
  const theme = useTheme(); // use the theme hook

  const goBack = () => {
    navigation.goBack();
  };
  return (
    <View
      style={{ ...styles.container, backgroundColor: theme.colors.background }}
    >
      {!home && (
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Icon name="arrow-back" size={40} color={theme.colors.secondary} />
        </TouchableOpacity>
      )}
      {!home && (
        <View style={styles.leftLayout}>
          <Text style={{ ...styles.headerText, color: theme.colors.secondary }}>
            {headerText}
          </Text>
        </View>
      )}

      {home && (
        <View style={{ ...styles.leftLayout, left: 0 }}>
          <Text style={{ ...styles.headerText, color: theme.colors.secondary }}>
            {headerText}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: '100%',
    borderBottomWidth: 0.8,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rightLayout: {
    marginRight: 10,
  },
  leftLayout: {
    position: 'absolute',
    top: 2,
    left: 50,
    padding: 10,
    marginLeft: 10,
  },
  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 10,
    zIndex: 1,
  },
});

export default Header;
