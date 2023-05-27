import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';

interface HeaderProps {
  home?: boolean;
  headerText: string;
}

const Header: React.FC<HeaderProps> = ({ home = false, headerText }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftLayout}>
        <Text style={styles.headerText}>{headerText}</Text>
      </View>
      {home && (
        <View style={styles.rightLayout}>
          <Image
            style={styles.profilePic}
            source={require('../assets/home/userImage.png')}
          />
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
    marginLeft: 10,
  },
  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  profilePic: {
    height: 45,
    width: 45,
    borderRadius: 30,
  },
});

export default Header;
