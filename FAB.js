import { Pressable, StyleSheet, Text } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from './src/styles/styles';

const FAB = props => {
  if (props.position === 'bottom-right') {
    return (
      <Pressable style={styles.containerBottomRight} onPress={props.onPress}>
        <Icon size={30} name="add" color="white" style="bold" />
        {/* <Text style={styles.title}>{props.title}</Text> */}
      </Pressable>
    );
  }
  //   if (props.position === 'top-right') {
  //     return (
  //       <Pressable
  //         style={styles.containerTopRight}
  //         onPress={props.onPress}
  //       >
  //         <
  //       </Pressable>
  //     );
  //   }
  else {
    return (
      <Pressable style={styles.containerTopRight} onPress={props.onPress}>
        <Icon size={30} name="add" color="white" style="bold" />
        {/* <Text style={styles.title}>{props.title}</Text> */}
      </Pressable>
    );
  }
};

export default FAB;

const styles = StyleSheet.create({
  containerBottomRight: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    position: 'absolute',
    bottom: 20,
    right: 40,
    backgroundColor: '#DA70D6',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  containerTopRight: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    position: 'absolute',
    top: 20,
    right: 40,
    backgroundColor: '#DA70D6',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
