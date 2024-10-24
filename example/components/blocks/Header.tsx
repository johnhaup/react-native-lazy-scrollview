import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { LazyChild } from 'react-native-lazy-scrollview';
import { Skeleton } from '../loaders/Skeleton';

const SCREEN_WIDTH = Dimensions.get('window').width;

export function Header() {
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
    <View style={styles.container}>
      <LazyChild
        onEnterThresholdPass={onEnterThresholdPass}
        onExitThresholdPass={onExitThresholdPass}
        onVisibilityEnter={onVisibilityEnter}
        onVisibilityExit={onVisibilityExit}
        percentVisibleThreshold={0.5}
      >
        <View style={styles.contentContainer}>
          <Skeleton show={!triggered}>
            <Image
              source={require('../../assets/header.jpg')}
              style={styles.image}
            />
          </Skeleton>
          {!isVisible ? <View style={styles.percentTextWrapper} /> : null}
        </View>
      </LazyChild>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: SCREEN_WIDTH,
  },
  contentContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.25,
    resizeMode: 'cover',
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
});
