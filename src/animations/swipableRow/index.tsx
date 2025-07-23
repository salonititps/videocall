import React, { useRef, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { moderateHeight } from '../../../responsive';
import { SwipeableRow, SwipeableRowRef } from './SwipeableRow';

const initialData = [
  { id: '1', text: 'First item' },
  { id: '2', text: 'Second item' },
  { id: '3', text: 'Third item' },
];

const SwipeAnimation = () => {
  const [data, setData] = useState(initialData);
  const openRowRef = useRef<SwipeableRowRef | null>(null);

  // Store refs for all rows by ID
  const rowRefs = useRef<Record<string, React.RefObject<SwipeableRowRef>>>({});

  const handleDelete = (id: string) => {
    rowRefs?.current[id]?.current?.close();

    setData(prev => prev.filter(item => item?.id !== id));

    delete rowRefs?.current[id];
  };

  const handleSwipeStart = (ref: SwipeableRowRef) => {
    if (openRowRef?.current && openRowRef?.current !== ref) {
      openRowRef?.current?.close();
    }
    openRowRef.current = ref;
  };

  const renderItem = ({ item }: { item: { id: string; text: string } }) => {
    if (!rowRefs?.current[item.id]) {
      rowRefs.current[item.id] = React.createRef<SwipeableRowRef>();
    }

    return (
      <SwipeableRow
        ref={rowRefs?.current[item?.id]}
        item={item}
        onDelete={handleDelete}
        onSwipeStart={() =>
          handleSwipeStart(rowRefs?.current[item?.id]?.current!)
        }
      />
    );
  };

  return (
    <GestureHandlerRootView>
      <TouchableWithoutFeedback
        onPress={() => {
          openRowRef.current?.close();
          Keyboard.dismiss();
        }}>
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>Swipe to Delete</Text>
          <FlatList
            data={data}
            keyExtractor={item => item?.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16, rowGap: moderateHeight(1) }}
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
};

export default SwipeAnimation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    paddingVertical: moderateHeight(5),
  },
  title: {
    fontSize: moderateHeight(2.8),
    fontWeight: 'bold',
    margin: moderateHeight(2),
  },
});
