import React, {useRef, useState, memo} from 'react';
import {View, Text, StyleSheet, StatusBar, PanResponder} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withTiming,
  runOnJS,
  FadeInUp,
  FadeOutDown,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';

import {moderateHeight, moderateWidth} from '../responsive';

const initialData = Array.from({length: 10}, (_, i) => ({
  title: `Title ${i + 1}`,
  director: `Director ${i + 1}`,
  year: `20${10 + i}`,
}));

const AnimatedPullToRefresh = () => {
  const insets = useSafeAreaInsets();

  // FlatList scroll offset tracking
  const scrollY = useSharedValue(0);

  // Pull distance tracking
  const pullY = useSharedValue(0);

  // React state for list (optional)
  const [listData, setListData] = useState(initialData);

  // Called after refresh animation completes
  const onRefreshComplete = () => {
    pullY.value = withTiming(0, {duration: 180});
  };

  // Actual refresh logic
  const triggerRefresh = () => {
    setTimeout(() => {
      console.log('Refresh complete');
      runOnJS(onRefreshComplete)();
    }, 2000);
  };

  // PanResponder for pull-to-refresh gesture
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, g) =>
        scrollY.value <= 0 && g.dy > 0, // Only activate if at top and pulling down

      onPanResponderMove: (_, g) => {
        const dy = Math.min(150, Math.max(0, g.dy)); // Clamp 0–150
        pullY.value = dy;
      },

      onPanResponderRelease: (_, g) => {
        const dy = Math.min(150, Math.max(0, g.dy));

        if (dy >= 75) {
          pullY.value = withTiming(120, {duration: 180});
          runOnJS(triggerRefresh)();
        } else {
          pullY.value = withTiming(0, {duration: 180});
        }
      },

      onPanResponderTerminate: () => {
        pullY.value = withTiming(0, {duration: 180});
      },
    }),
  ).current;

  // Track FlatList scroll position
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Pull-down animated style
  const pullDownStyle = useAnimatedStyle(() => ({
    transform: [{translateY: pullY.value}],
  }));

  // Lottie loader animated style
  const loaderStyle = useAnimatedStyle(() => ({
    height: pullY.value,
    top: pullY.value - 200,
    opacity: 1,
  }));

  // Render each FlatList item
  const renderItem = ({item}: {item: (typeof initialData)[0]}) => (
    <Animated.View entering={FadeInUp} exiting={FadeOutDown}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subTitle}>{`${item.director} | ${item.year}`}</Text>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000" />

      {/* Lottie loader */}
      <Animated.View style={[styles.loaderContainer, loaderStyle]}>
        <LottieView
          source={require('../assets/lottie-refresh.json')}
          autoPlay
          loop
          speed={0.5}
          style={[styles.loader, {paddingTop: insets.top > 0 ? insets.top : 0}]}
        />
      </Animated.View>

      <Animated.View
        style={[
          pullDownStyle,
          styles.pullDownStyles,
          {paddingTop: Math.max(insets.top, 15)},
        ]}
        {...panResponder.panHandlers}>
        <Animated.FlatList
          data={listData}
          renderItem={renderItem}
          keyExtractor={(_, i) => i.toString()}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          ItemSeparatorComponent={() => (
            <View style={styles.itemSeparatorStyle} />
          )}
        />
      </Animated.View>
    </View>
  );
};

export default memo(AnimatedPullToRefresh);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    flex: 1,
  },
  pullDownStyles: {
    backgroundColor: '#0A0A0A',
    flex: 1,
    paddingHorizontal: moderateWidth(5),
  },
  itemSeparatorStyle: {
    margin: moderateHeight(2),
  },
  loader: {
    width: moderateWidth(100),
    height: moderateHeight(32),
  },
  loaderContainer: {
    alignItems: 'center',
    width: moderateWidth(100),
    position: 'absolute',
  },
  title: {
    color: '#fff',
    fontSize: moderateHeight(2.5),
    fontWeight: '600',
  },
  subTitle: {
    color: '#888',
    fontSize: moderateHeight(2),
    fontWeight: '600',
  },
});
