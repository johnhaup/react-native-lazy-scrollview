import React, { ComponentProps, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { LazyChild } from 'react-native-lazy-scrollview';
import { SQUARE_SIZE } from '../../constants';

export function FireOnceBlock(
  props: Omit<ComponentProps<typeof LazyChild>, 'children'>
) {
  const [triggered, setTriggered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const onEnterThresholdPass = () => {
    setTriggered(true);
  };

  const onVisibilityEnter = () => {
    setIsVisible(true);
  };

  const backgroundColor = useMemo(
    () => (triggered ? '#f8a5c2' : '#d1d8e0'),
    [triggered]
  );

  return (
    <LazyChild
      onEnterThresholdPass={onEnterThresholdPass}
      onVisibilityEnter={onVisibilityEnter}
      {...props}
    >
      <View style={styles.container}>
        {triggered ? (
          <View style={[styles.container, { backgroundColor }]}>
            <Text style={styles.text}>
              I didn't provide exit functions so my entering callbacks fire only
              once, then measurement stops 🤯
            </Text>
          </View>
        ) : (
          <ActivityIndicator />
        )}
        {!isVisible && props.percentVisibleThreshold ? (
          <View style={styles.percentTextWrapper}>
            <Text style={styles.percentText}>{`${
              props.percentVisibleThreshold * 100
            } not visible`}</Text>
          </View>
        ) : null}
      </View>
    </LazyChild>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    alignSelf: 'center',
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    padding: 16,
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
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
});
