import { StyleSheet } from 'react-native';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Animations from './src/animations';
import PullRefreshAnimation from './src/animations/pullRefresh';
import SwipeAnimation from './src/animations/swipableRow';
import TinderCardAnimation from './src/animations/tinderCard';
import ZoomImageAnimation from './src/animations/zoomImage';
import OtaUpdate from './src/otaUpdate';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <GestureHandlerRootView style={styles.container}>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Animation">
          <Stack.Screen name={'Animation'} component={Animations} />
          <Stack.Screen
            name={'PullToRefresh'}
            component={PullRefreshAnimation}
          />
          <Stack.Screen name={'SwipeRow'} component={SwipeAnimation} />
          <Stack.Screen name={'TinderCard'} component={TinderCardAnimation} />
          <Stack.Screen name={'ZoomImage'} component={ZoomImageAnimation} />
          <Stack.Screen name={'OTA'} component={OtaUpdate} />
        </Stack.Navigator>
      </GestureHandlerRootView>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
});
