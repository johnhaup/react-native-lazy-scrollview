import React, { ComponentProps, useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { LazyChild } from 'react-native-lazy-scrollview';
import { SQUARE_SIZE } from '../../constants';

const MS = 2000;

export function MsVisibility(
  props: Omit<ComponentProps<typeof LazyChild>, 'children'>
) {
  const [triggered, setTriggered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [visCount, setVisCount] = useState(0);

  const onEnterThresholdPass = () => {
    setTriggered(true);
  };

  const onVisibilityEnter = useCallback(() => {
    setIsVisible(true);
    setVisCount((p) => p + 1);
  }, []);

  const onVisibilityExit = () => {
    setIsVisible(false);
  };

  const backgroundColor = useMemo(
    () => (triggered ? '#f5cd79' : '#d1d8e0'),
    [triggered]
  );

  const borderColor = useMemo(
    () => (isVisible ? '#778beb' : 'transparent'),
    [isVisible]
  );

  const textColor = useMemo(
    () => (isVisible ? '#778beb' : 'black'),
    [isVisible]
  );

  return (
    <View style={styles.container}>
      <LazyChild
        onEnterThresholdPass={onEnterThresholdPass}
        onVisibilityEnter={onVisibilityEnter}
        onVisibilityExit={onVisibilityExit}
        minimumVisibilityMs={MS}
        {...props}
      >
        <View
          style={[styles.contentContainer, { backgroundColor, borderColor }]}
        >
          {triggered ? (
            <Text style={[styles.text, { color: textColor }]}>
              {`Fire callback after ${MS}ms visibility\n${visCount} times`}
            </Text>
          ) : (
            <ActivityIndicator />
          )}
          {isVisible ? (
            <View style={styles.visibilityWrapper}>
              <Text style={[styles.visibilityText]}>Visibility triggered!</Text>
            </View>
          ) : null}
        </View>
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
    borderWidth: 1,
  },
  visibilityWrapper: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#778beb',
  },
  visibilityText: {
    color: 'white',
    fontSize: 16,
    padding: 8,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
  },
});
