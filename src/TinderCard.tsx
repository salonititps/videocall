import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

import {moderateHeight, moderateWidth} from '../responsive';

const {width, height} = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

const TinderCard = ({CARDS}) => {
  const cards = useRef(CARDS);
  const [visibleIndex, setVisibleIndex] = useState(0); // State to track current visible card
  const currentIndex = useSharedValue(0); // Shared value to sync with Reanimated

  // Shared values for card position and rotation
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const flipRotation = useSharedValue(0);

  // Opacity values for swipe direction overlays
  const opacityRight = useSharedValue(0);
  const opacityLeft = useSharedValue(0);
  const opacityTop = useSharedValue(0);
  const opacityBottom = useSharedValue(0);

  // Sync visible card index between JS and UI thread
  const syncIndex = (newIndex: number) => {
    setVisibleIndex(newIndex);
    currentIndex.value = newIndex;
  };

  // Reset position and move to next card
  const swipeToNextCard = () => {
    'worklet';
    const newIndex = currentIndex.value + 1;
    runOnJS(syncIndex)(newIndex);

    translateX.value = 0;
    translateY.value = 0;
    rotate.value = 0;
    opacityRight.value = 0;
    opacityLeft.value = 0;
    opacityTop.value = 0;
    opacityBottom.value = 0;
  };

  // Handle drag/swipe gestures
  const gestureHandler =
    useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
      onActive: event => {
        // Update position and rotation as user drags
        translateX.value = event.translationX;
        translateY.value = event.translationY;
        rotate.value = (translateX.value / width) * 15;

        // Update directional overlay opacities
        opacityRight.value =
          translateX.value > 0 ? translateX.value / width : 0;
        opacityLeft.value =
          translateX.value < 0 ? -translateX.value / width : 0;
        opacityTop.value =
          translateY.value < 0 ? -translateY.value / height : 0;
        opacityBottom.value =
          translateY.value > 0 ? translateY.value / height : 0;
      },
      onEnd: () => {
        const absX = Math.abs(translateX.value);
        const absY = Math.abs(translateY.value);

        // Decide swipe direction or reset
        if (absX > SWIPE_THRESHOLD) {
          // Left right swipe
          const direction = translateX.value > 0 ? 1 : -1;
          translateX.value = withSpring(
            direction * width * 1.5,
            {},
            swipeToNextCard,
          );
        } else if (absY > SWIPE_THRESHOLD) {
          //Top bottom swipe
          const direction = translateY.value > 0 ? 1 : -1;
          translateY.value = withSpring(
            direction * height * 1.5,
            {},
            swipeToNextCard,
          );
        } else {
          // Reset card to original position
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
          rotate.value = withSpring(0);
        }
      },
    });

  // Style for top card (animated position + rotation)
  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: translateX.value},
      {translateY: translateY.value},
      {rotate: `${rotate.value}deg`},
      {rotateY: `${flipRotation.value}deg`},
    ],
  }));

  // Overlay style based on direction and opacity
  const overlayStyle = (opacity, color) =>
    useAnimatedStyle(() => ({
      ...StyleSheet.absoluteFillObject,
      backgroundColor: color,
      opacity: opacity.value,
    }));

  // Optional flip animation function
  // const flipCard = () => {
  //   flipRotation.value = withTiming(flipRotation.value === 0 ? 180 : 0, {
  //     duration: 400,
  //   });
  // };

  // Renders a card (front or back)
  const renderCard = (text: string, isBack = false) => (
    <View style={[styles.card, isBack && styles.cardBackStack]}>
      <Text style={styles.cardText}>{text}</Text>
    </View>
  );

  const currentCard = cards.current[visibleIndex];
  const nextCard = cards.current[visibleIndex + 1];

  return (
    <View style={{flex: 1}}>
      <View style={styles.stackContainer}>
        {currentCard ? (
          <>
            {/* Next card (in background) */}
            {nextCard && (
              <View style={[styles.card, styles.cardBackStack]}>
                {renderCard(nextCard, true)}
              </View>
            )}

            {/* Top card with swipe gesture */}
            <PanGestureHandler onGestureEvent={gestureHandler}>
              <Animated.View style={[styles.card, animatedCardStyle]}>
                {flipRotation.value < 90
                  ? renderCard(currentCard)
                  : renderCard('Flipped 🚀')}

                {/* Overlays for direction feedback */}
                <Animated.View style={overlayStyle(opacityRight, 'green')} />
                <Animated.View style={overlayStyle(opacityLeft, 'red')} />
                <Animated.View style={overlayStyle(opacityTop, 'blue')} />
                <Animated.View style={overlayStyle(opacityBottom, 'orange')} />
              </Animated.View>
            </PanGestureHandler>
          </>
        ) : (
          // All cards swiped message
          <Text style={styles.emptyText}>🎉 All cards swiped!</Text>
        )}
      </View>

      {currentCard && (
        <View style={styles.buttonsContainer}>
          {/* Flip button (commented out) */}
          {/* <TouchableOpacity style={styles.button} onPress={flipCard}>
            <Text style={styles.buttonText}>Flip</Text>
          </TouchableOpacity> */}

          {/* Manual swipe buttons */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              opacityRight.value = withTiming(1, {duration: 100});
              translateX.value = withSpring(width * 1.5, {}, swipeToNextCard);
            }}>
            <Text style={styles.buttonText}>Swipe Right</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              opacityLeft.value = withTiming(1, {duration: 100});
              translateX.value = withSpring(-width * 1.5, {}, swipeToNextCard);
            }}>
            <Text style={styles.buttonText}>Swipe Left</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default TinderCard;

// Style definitions
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  stackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    position: 'absolute',
    width: moderateWidth(90),
    height: moderateHeight(70),
    borderRadius: moderateWidth(5),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: moderateHeight(1)},
    backfaceVisibility: 'hidden',
  },
  cardBackStack: {
    transform: [{scale: 0.95}, {translateY: 15}],
    backgroundColor: '#eee',
    zIndex: -1,
  },
  cardText: {
    fontSize: moderateHeight(4),
    fontWeight: 'bold',
    color: '#333',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: moderateHeight(5),
    gap: moderateWidth(5),
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#3A3D45',
    paddingHorizontal: moderateWidth(5),
    paddingVertical: moderateHeight(1.5),
    borderRadius: moderateHeight(5),
  },
  buttonText: {
    color: '#fff',
    fontSize: moderateHeight(2),
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: moderateHeight(4),
    fontWeight: 'bold',
    color: '#666',
  },
});
