import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import React, { useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';

import { moderateHeight, moderateWidth } from '../../responsive';
import { BASE_URL } from '@env';

const animations = [
  {
    id: 1,
    name: 'Pull to Refresh',
    navigation: 'PullToRefresh',
  },
  {
    id: 2,
    name: 'Swipe on actions',
    navigation: 'SwipeRow',
  },
  {
    id: 3,
    name: 'Zoom Image',
    navigation: 'ZoomImage',
  },
  {
    id: 4,
    name: 'Tinder Cards',
    navigation: 'TinderCard',
  },
  {
    id: 5,
    name: 'OTA Update',
    navigation: 'OTA',
  },
];

const Animations = () => {
  const navigation = useNavigation();

  useEffect(() => {
    Alert.alert(
      `${BASE_URL} , ${DeviceInfo.getVersion()} , ${DeviceInfo.getBuildNumber()}`,
    );
  }, []);

  const renderItem = ({ item }: any) => {
    const handleNavigation = () => {
      navigation.navigate(item?.navigation);
    };
    return (
      <TouchableOpacity onPress={handleNavigation} style={styles.itemView}>
        <Text style={styles.text}>{item?.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={animations}
        keyExtractor={(_, i) => i?.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Animations;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: moderateHeight(5),
  },
  itemView: {
    marginTop: moderateHeight(2),
    padding: moderateWidth(5),
    backgroundColor: 'skyblue',
    alignItems: 'center',
  },
  text: {
    fontSize: moderateHeight(1.8),
    fontWeight: 'bold',
  },
});
