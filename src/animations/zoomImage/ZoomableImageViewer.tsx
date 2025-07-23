import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { moderateHeight, moderateWidth } from '../../../responsive';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ZoomableImageViewerProps {
  uri: string;
  onDismiss?: () => void; // Called when image is swiped down
}

export const ZoomableImageViewer: React.FC<ZoomableImageViewerProps> = ({
  uri,
  onDismiss,
}) => {
  // Shared values for zoom and pan
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedX = useSharedValue(0); // Store last pan X offset
  const savedY = useSharedValue(0); // Store last pan Y offset
  const focalX = useSharedValue(0); // Focal point X for double-tap zoom
  const focalY = useSharedValue(0); // Focal point Y for double-tap zoom

  // Zoom limits
  const doubleTapZoom = 2;
  const maxZoom = 4;
  const minZoom = 1;

  // Pinch gesture for zooming
  const pinchGesture = Gesture.Pinch()
    .onUpdate(e => {
      const newScale = e.scale * scale.value;
      if (newScale < minZoom || newScale > maxZoom) return;
      scale.value = newScale;
    })
    .onEnd(() => {
      // Snap back to limits if zoomed too far
      if (scale.value < minZoom) {
        scale.value = withSpring(minZoom);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedX.value = 0;
        savedY.value = 0;
      } else if (scale.value > maxZoom) {
        scale.value = withSpring(maxZoom);
      } else {
        savedX.value = translateX.value;
        savedY.value = translateY.value;
      }
    });

  // Pan gesture to move the image when zoomed in
  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      if (scale.value > 1) {
        translateX.value = savedX.value + e.translationX;
        translateY.value = savedY.value + e.translationY;
      }
    })
    .onEnd(e => {
      if (scale.value > 1) {
        savedX.value = translateX.value;
        savedY.value = translateY.value;
      }

      // Dismiss on vertical swipe if not zoomed in
      if (scale.value === 1 && Math.abs(e.translationY) > 100 && onDismiss) {
        runOnJS(onDismiss)();
      }
    });

  // Double-tap gesture to zoom in/out centered at tap position
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(e => {
      focalX.value = e.x - SCREEN_WIDTH / 2;
      focalY.value = e.y - SCREEN_HEIGHT / 2;
    })
    .onEnd(() => {
      if (scale.value > 1) {
        // Reset zoom
        scale.value = withTiming(1);
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        savedX.value = 0;
        savedY.value = 0;
      } else {
        // Zoom in to tap focal point
        scale.value = withTiming(doubleTapZoom);
        translateX.value = withTiming(-focalX.value);
        translateY.value = withTiming(-focalY.value);
        savedX.value = -focalX.value;
        savedY.value = -focalY.value;
      }
    });

  // allow pan & double tap race, and simultaneous pinch
  const composedGesture = Gesture.Simultaneous(
    Gesture.Race(doubleTapGesture, panGesture),
    pinchGesture,
  );

  // Animated style for image transform
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.Image
        source={{ uri }}
        style={[styles.image, animatedStyle]}
        resizeMode="contain"
      />
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  image: {
    width: moderateWidth(100),
    height: moderateHeight(100),
  },
});
