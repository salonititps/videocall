// import React, {useEffect, useState} from 'react';
// import {StyleSheet, Text, View} from 'react-native';

// import {
//   Call,
//   StreamCall,
//   useStreamVideoClient,
//   CallContent,
//   useAutoEnterPiPEffect,
//   useIsInPiPMode,
// } from '@stream-io/video-react-native-sdk';

// type Props = {goToHomeScreen: () => void; callId: string};

// export const CallScreen = ({goToHomeScreen, callId}: Props) => {
//   const [call, setCall] = useState<Call | null>(null);
//   const client = useStreamVideoClient();

//   // 🔁 Auto-enter PiP mode when app goes to background (Android)
//   useAutoEnterPiPEffect();

//   // 🟢 Optional: Check if currently in PiP mode
//   const isInPiPMode = useIsInPiPMode();

//   useEffect(() => {
//     if (client) {
//       const callInstance = client.call('default', callId);
//       callInstance.join({create: true}).then(() => setCall(callInstance));
//     }
//   }, [client, callId]);

//   if (!call) {
//     return (
//       <View style={joinStyles.container}>
//         <Text style={styles.text}>Joining call...</Text>
//       </View>
//     );
//   }

//   return (
//     <StreamCall call={call}>
//       <View style={styles.container}>
//         {/* Optional indicator for PiP mode */}

//         <CallContent onHangupCallHandler={goToHomeScreen} />
//       </View>
//     </StreamCall>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   text: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#005fff',
//   },
//   pipText: {
//     textAlign: 'center',
//     color: 'gray',
//     fontSize: 12,
//     paddingVertical: 4,
//   },
// });

// const joinStyles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     padding: 20,
//   },
// });
import React, {useEffect, useState} from 'react';
import {BackHandler, Platform, StyleSheet, Text, View} from 'react-native';
import RNMinimizeApp from 'react-native-minimize';

import {
  Call,
  StreamCall,
  useStreamVideoClient,
  CallContent,
  useAutoEnterPiPEffect,
  useIsInPiPMode,
} from '@stream-io/video-react-native-sdk';

type Props = {
  goToHomeScreen: () => void; // You can remove this if you're not navigating manually
  callId: string;
};

export const CallScreen = ({goToHomeScreen, callId}: Props) => {
  const [call, setCall] = useState<Call | null>(null);
  const client = useStreamVideoClient();
  const isInPiPMode = useIsInPiPMode();

  // ✅ Automatically enter PiP when app is backgrounded
  useAutoEnterPiPEffect();

  // ✅ Handle Android back button to trigger PiP
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (Platform.OS === 'android') {
          RNMinimizeApp.minimizeApp();
          goToHomeScreen(); // ✅ Triggers PiP via background
          return true; // Prevent default back behavior
        }
        return false;
      },
    );

    return () => backHandler.remove();
  }, []);

  // ✅ Join the call on mount
  useEffect(() => {
    if (client) {
      const callInstance = client.call('default', callId);
      callInstance
        .join({create: true})
        .then(() => setCall(callInstance))
        .catch(err => console.error('Call join error:', err));
    }
  }, [client, callId]);

  // ⏳ Show loading text while joining
  if (!call) {
    return (
      <View style={joinStyles.container}>
        <Text style={styles.text}>Joining call...</Text>
      </View>
    );
  }

  return (
    <StreamCall call={call}>
      <View style={styles.container}>
        <CallContent onHangupCallHandler={goToHomeScreen} />
      </View>
    </StreamCall>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#005fff',
  },
  pipText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 12,
    paddingVertical: 4,
  },
});

const joinStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
