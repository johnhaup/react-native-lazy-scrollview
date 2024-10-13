import { ComponentProps, useMemo, useState } from 'react';
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
    <View style={styles.container}>
      <LazyChild
        onEnterThresholdPass={onEnterThresholdPass}
        onVisibilityEnter={onVisibilityEnter}
        {...props}
      >
        <View style={[styles.contentContainer, { backgroundColor }]}>
          {triggered ? (
            <Text style={styles.text}>
              I didn't provide exit functions so my entering callbacks fire only
              once, then measurement stops 🤯
            </Text>
          ) : (
            <ActivityIndicator />
          )}
        </View>

        {!isVisible && props.percentVisibleThreshold ? (
          <View style={styles.percentTextWrapper}>
            <Text style={styles.percentText}>{`${
              props.percentVisibleThreshold * 100
            } not visible`}</Text>
          </View>
        ) : null}
      </LazyChild>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
  },
  contentContainer: {
    width: SQUARE_SIZE - 16,
    height: SQUARE_SIZE - 16,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
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
