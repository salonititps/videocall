// import {StyleSheet} from 'react-native';
// import React from 'react';
// import {ZoomableImageViewer} from './src/ZoomableImageViewer';
// import {GestureHandlerRootView} from 'react-native-gesture-handler';

// const App = () => {
//   return (
//     <GestureHandlerRootView style={styles.root}>
//       <ZoomableImageViewer
//         uri="https://picsum.photos/id/237/800/600"
//         // onDismiss={() => navigation.goBack()}
//       />
//     </GestureHandlerRootView>
//   );
// };

// export default App;

// const styles = StyleSheet.create({
//   root: {
//     flex: 1,
//     backgroundColor: '#000',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

//Pull to refresh animated
// import React from 'react';
// import {SafeAreaProvider} from 'react-native-safe-area-context';
// import AnimatedPullToRefresh from './src/AnimatedPullToRefresh'; // or your root navigator

// const App = () => {
//   return (
//     <SafeAreaProvider>
//       <AnimatedPullToRefresh />
//     </SafeAreaProvider>
//   );
// };

// export default App;

// Swpie to delete cards
// import React, {useRef, useState} from 'react';
// import {
//   FlatList,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableWithoutFeedback,
//   Keyboard,
// } from 'react-native';
// import {GestureHandlerRootView} from 'react-native-gesture-handler';
// import {SwipeableRow, SwipeableRowRef} from './src/SwipeableRow';
// import {moderateHeight} from './responsive';

// const initialData = [
//   {id: '1', text: 'First item'},
//   {id: '2', text: 'Second item'},
//   {id: '3', text: 'Third item'},
// ];

// const App = () => {
//   const [data, setData] = useState(initialData);
//   const openRowRef = useRef<SwipeableRowRef | null>(null);

//   // Store refs for all rows by ID
//   const rowRefs = useRef<Record<string, React.RefObject<SwipeableRowRef>>>({});

//   const handleDelete = (id: string) => {
//     rowRefs?.current[id]?.current?.close();

//     setData(prev => prev.filter(item => item?.id !== id));

//     delete rowRefs?.current[id];
//   };

//   const handleSwipeStart = (ref: SwipeableRowRef) => {
//     if (openRowRef?.current && openRowRef?.current !== ref) {
//       openRowRef?.current?.close();
//     }
//     openRowRef.current = ref;
//   };

//   const renderItem = ({item}: {item: {id: string; text: string}}) => {
//     if (!rowRefs?.current[item.id]) {
//       rowRefs.current[item.id] = React.createRef<SwipeableRowRef>();
//     }

//     return (
//       <SwipeableRow
//         ref={rowRefs?.current[item?.id]}
//         item={item}
//         onDelete={handleDelete}
//         onSwipeStart={() =>
//           handleSwipeStart(rowRefs?.current[item?.id]?.current!)
//         }
//       />
//     );
//   };

//   return (
//     <GestureHandlerRootView>
//       <TouchableWithoutFeedback
//         onPress={() => {
//           openRowRef.current?.close();
//           Keyboard.dismiss();
//         }}>
//         <SafeAreaView style={styles.container}>
//           <Text style={styles.title}>Swipe to Delete</Text>
//           <FlatList
//             data={data}
//             keyExtractor={item => item?.id}
//             renderItem={renderItem}
//             contentContainerStyle={{padding: 16, rowGap: moderateHeight(1)}}
//           />
//         </SafeAreaView>
//       </TouchableWithoutFeedback>
//     </GestureHandlerRootView>
//   );
// };

// export default App;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fafafa',
//   },
//   title: {
//     fontSize: moderateHeight(2.8),
//     fontWeight: 'bold',
//     margin: moderateHeight(2),
//   },
// });

//Tinder card
// const CARDS = ['Card 1', 'Card 2', 'Card 3', 'Card 4', 'Card 5'];

// import {StyleSheet} from 'react-native';
// import React from 'react';
// import TinderCard from './src/TinderCard';
// import {GestureHandlerRootView} from 'react-native-gesture-handler';

// const App = () => {
//   return (
//     <GestureHandlerRootView style={styles.container}>
//       <TinderCard CARDS={CARDS} />
//     </GestureHandlerRootView>
//   );
// };

// export default App;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: '#f9f9f9',
//   },
// });

import {View, Text, Alert} from 'react-native';
import React, {useEffect} from 'react';
import {BASE_URL} from '@env';

const App = () => {
  useEffect(() => {
    Alert.alert(BASE_URL);
  }, []);
  return (
    <View>
      <Text>App</Text>
    </View>
  );
};

export default App;
