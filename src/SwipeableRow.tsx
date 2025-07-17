import React, {forwardRef, useImperativeHandle, useRef, memo} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

import {moderateHeight, moderateWidth} from '../responsive';

const SWIPE_LIMIT = 120;
const SWIPE_THRESHOLD = 100;

export interface SwipeableRowRef {
  close: () => void;
}

interface Props {
  item: {id: string; text: string};
  onDelete: (id: string) => void;
  onSwipeStart?: () => void;
}

const SwipeableRowComponent = (
  {item, onDelete, onSwipeStart}: Props,
  ref: React.Ref<SwipeableRowRef>,
) => {
  const translateX = useSharedValue(0); // Current position of the swiped row
  const offsetX = useSharedValue(0); // Previous offset to allow bidirectional dragging
  const isOpen = useRef(false); // Track if the row is currently open
  const isDeleted = useRef(false); // Track if row is deleted

  // Configure the pan gesture
  const panGesture = Gesture.Pan()
    .onStart(() => {
      // Notify parent if a new swipe begins
      if (!isOpen.current && onSwipeStart) {
        runOnJS(onSwipeStart)();
      }

      // Notify parent if a new swipe begins
      // if (onSwipeStart && !isDeleted.current) {
      //   runOnJS(onSwipeStart)();
      // }
    })
    .onUpdate(e => {
      // Allow swiping in both directions within defined bounds
      const newTranslate = e.translationX + offsetX.value;
      if (newTranslate >= -SWIPE_LIMIT && newTranslate <= SWIPE_LIMIT) {
        translateX.value = newTranslate;
      }

      // Allow swiping in both directions within defined bounds
      // translateX.value = e.translationX;
    })
    .onEnd(() => {
      // Handle release and snap to open/close
      if (translateX.value <= -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-SWIPE_LIMIT);
        offsetX.value = -SWIPE_LIMIT;
        isOpen.current = true;
      } else if (translateX.value >= SWIPE_THRESHOLD) {
        translateX.value = withSpring(SWIPE_LIMIT);
        offsetX.value = SWIPE_LIMIT;
        isOpen.current = true;
      } else {
        translateX.value = withSpring(0);
        offsetX.value = 0;
        isOpen.current = false;
      }

      //swipe whole card
      // if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
      //   // Swipe far enough → delete
      //   const direction = translateX.value > 0 ? 500 : -500;
      //   translateX.value = withTiming(direction, {duration: 200}, () => {
      //     if (!isDeleted.current) {
      //       isDeleted.current = true;
      //       runOnJS(onDelete)(item.id);
      //     }
      //   });
      // } else {
      //   // Not far enough → reset
      //   translateX.value = withSpring(0);
      // }
    });

  // Apply the horizontal movement to the animated style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });

  // Called when the user taps Delete
  const handleDelete = () => {
    onDelete(item?.id); // Trigger deletion from parent
    translateX.value = withSpring(0); // Reset swipe position
    offsetX.value = 0;
    isOpen.current = false;
  };

  // Allow parent to close the row programmatically
  useImperativeHandle(ref, () => ({
    close: () => {
      translateX.value = withSpring(0);

      offsetX.value = 0;
      isOpen.current = false;
    },
  }));

  return (
    <Animated.View
      style={styles.rowContainer}
      entering={FadeIn}
      exiting={FadeOut}>
      <View style={styles.hiddenRow}>
        {/* Left-side Delete (for right swipe) */}
        <View style={styles.leftAction}>
          <Pressable onPress={handleDelete}>
            <Text style={styles.deleteText}>Delete</Text>
          </Pressable>
        </View>

        {/* Right-side Delete (for left swipe) */}
        <View style={styles.rightAction}>
          <Pressable onPress={handleDelete}>
            <Text style={styles.deleteText}>Delete</Text>
          </Pressable>
        </View>
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.rowFront, animatedStyle]}>
          <Text style={styles.rowText}>{item.text}</Text>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

export const SwipeableRow = memo(forwardRef(SwipeableRowComponent));

const styles = StyleSheet.create({
  rowContainer: {
    width: '100%',
    height: moderateHeight(7),
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
    borderRadius: moderateWidth(2),
  },
  hiddenRow: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ff3b30',
    alignItems: 'center',
    paddingHorizontal: moderateWidth(5),
  },
  leftAction: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  rightAction: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: moderateHeight(2),
  },
  rowFront: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingLeft: moderateWidth(5),
    borderRadius: moderateWidth(2),
  },
  rowText: {
    fontSize: moderateHeight(2.5),
    fontWeight: 'bold',
  },
});
