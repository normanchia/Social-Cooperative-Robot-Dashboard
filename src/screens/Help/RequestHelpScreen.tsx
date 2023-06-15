import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { mainContainer, bodyContainer, colors } from '../../styles/styles';
import Header from '../../components/Header';
import { useTheme } from 'react-native-paper';

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
        {/* Main Content */}
        <View style={{ ...bodyContainer.container }}>
          <Text style={{ ...styles.headerText, color: theme.colors.secondary }}>
            Title
          </Text>
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
});

export default RequestHelpScreen;
