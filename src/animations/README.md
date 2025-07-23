## 🧼 Swipe to Reveal Actions

This implementation provides a **clean and interactive swipeable list** using **React Native Reanimated** and **Gesture Handler**.

Each row can be swiped **left or right** to reveal action buttons such as **Delete**. Only **one row stays open at a time**, ensuring a smooth and controlled user experience.

Additionally, the component supports:

- **Programmatic row closure**
- **Full card swipe to trigger actions**

### ✨ Features

- **Swipe left or right** to reveal actions
- **Delete** via swipe or button press
- **Only one open row** at a time (auto-closes others)
- **Full card swipe** to trigger immediate actions

---

## 🔄 Pull to Refresh with Lottie Animations

This React Native component implements an animated pull-to-refresh list using **PanResponder**, **react-native-reanimated**, and **lottie-react-native**. It features a smooth pull-down gesture that triggers a **Lottie-based loading animation** when pulled beyond a certain threshold.

The list animates downward using `translateY`, and each item enters and exits with **fade animations**. The refresh action is simulated and resets the list position after a short delay. **Responsive utilities** ensure it adapts well across devices, and **safe area insets** are respected for a clean, edge-to-edge design.

### ✨ Features

- Pull-to-refresh with **natural rubber-band animation**
- Integrated **Lottie animation** for loading state
- FlatList with **animated item appearance**

---

## 🔍 Pinch-to-Zoom Image Viewer

This React Native component, **`ZoomableImageViewer`**, provides a **fluid and intuitive zoom-and-pan experience** for images using **react-native-reanimated** and **react-native-gesture-handler**.

It supports **pinch-to-zoom**, **drag-to-pan**, and **double-tap zoom** using advanced gesture composition. A **swipe-down-to-dismiss** gesture is available when the image is not zoomed in, making it perfect for **image preview modals or galleries**.

Animations are **smooth and responsive**, with zoom level constraints to ensure a natural feel.

### ✨ Features

- **Pinch-to-Zoom**: Use two fingers to zoom in or out with natural spring animations
- **Double-Tap Zoom**: Double-tap to zoom into a focal point or reset to original scale
- **Drag-to-Pan**: Move the image around when zoomed using a one-finger pan gesture
- **Swipe-Down to Dismiss**: Close viewer easily when image is at base scale

---

## 💳 Draggable Cards Like Tinder

This Tinder-style swipe card component enables users to interact with a **stack of cards** using **smooth drag gestures** powered by **react-native-reanimated** and **react-native-gesture-handler**.

The top card responds to **horizontal and vertical swipe gestures**, with **dynamic rotation** and **color overlays** indicating the swipe direction (`left`, `right`, `up`, or `down`). Once swiped past a configurable threshold, the card animates off-screen, and the next card appears.

The stack supports:

- **Gesture handling**
- **Spring-based animations**
- **Manual swipe controls**
- **Optional flip animation**

### ✨ Features

- **Swipe Gestures**: Drag left, right, up, or down to swipe cards off the screen
- **Direction Feedback**: Color overlays (green, red, blue, orange) based on swipe direction
- **Stacked View**: Shows the next card subtly scaled/translated in the background
- **Manual Controls**: Buttons to trigger left/right swipes programmatically
- **Flip Animation (Optional)**: Basic support for Y-axis card flipping
