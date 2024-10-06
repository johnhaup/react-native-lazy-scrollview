import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LazyChild } from 'react-native-lazy-scrollview';
import { SQUARE_SIZE } from '../../constants';

export function ImageBlock({
  source,
  percentVisibleThreshold,
}: {
  source: ImageSourcePropType;
  percentVisibleThreshold: number;
}) {
  const [triggered, setTriggered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const onEnterThresholdPass = () => {
    setTriggered(true);
  };

  const onExitThresholdPass = () => {
    setTriggered(false);
  };

  const onVisibilityEnter = () => {
    setIsVisible(true);
  };

  const onVisibilityExit = () => {
    setIsVisible(false);
  };

  return (
    <LazyChild
      onEnterThresholdPass={onEnterThresholdPass}
      onExitThresholdPass={onExitThresholdPass}
      onVisibilityEnter={onVisibilityEnter}
      onVisibilityExit={onVisibilityExit}
      percentVisibleThreshold={percentVisibleThreshold}
    >
      <View style={styles.container}>
        {triggered ? (
          <Image source={source} style={styles.image} />
        ) : (
          <ActivityIndicator />
        )}
        {!isVisible && (
          <View style={styles.percentTextWrapper}>
            <Text style={styles.percentText}>{`${
              percentVisibleThreshold * 100
            } not visible`}</Text>
          </View>
        )}
      </View>
    </LazyChild>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#d1d8e0',
    alignSelf: 'center',
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
  },
  image: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
  },
  percentTextWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentText: {
    color: 'red',
    fontSize: 16,
    padding: 8,
    textAlign: 'center',
  },
});
