import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AnimatedPullToRefresh from './AnimatedPullToRefresh';

const PullRefreshAnimation = () => {
  return (
    <SafeAreaProvider>
      <AnimatedPullToRefresh />
    </SafeAreaProvider>
  );
};

export default PullRefreshAnimation;
