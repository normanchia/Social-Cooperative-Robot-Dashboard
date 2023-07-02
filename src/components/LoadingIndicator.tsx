import React from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';

const LoadingIndicator: React.FC = () => {
  const theme = useTheme();
  const styles = StyleSheet.create({
    activityIndicator: {
      backgroundColor: theme.colors.backdrop,
      position: 'absolute',
      bottom: 0,
      top: 0,
      right: 0,
      left: 0,
      zIndex: 9998,
    },
  });

  return (
    <>
      <ActivityIndicator
        color={theme.colors.primary}
        size="large"
        style={styles.activityIndicator}
      ></ActivityIndicator>
    </>
  );
};

export default LoadingIndicator;
