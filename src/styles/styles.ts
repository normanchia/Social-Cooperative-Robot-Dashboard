import { StyleSheet, Platform, StatusBar } from 'react-native';

export const colors = {
  primary: '#2072b3',
  black: '#222222',
  white: '#ffffff',
};

export const mainContainer = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flex: 1,
    backgroundColor: colors.white,
  },
});

export const bodyContainer = StyleSheet.create({
  container: {
    margin: 10,
  },
});
