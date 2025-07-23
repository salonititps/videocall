import { StyleSheet } from 'react-native';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TinderCard from './TinderCard';

//Tinder card
const CARDS = ['Card 1', 'Card 2', 'Card 3', 'Card 4', 'Card 5'];

const TinderCardAnimation = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <TinderCard CARDS={CARDS} />
    </GestureHandlerRootView>
  );
};

export default TinderCardAnimation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
});
