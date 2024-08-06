import sample from 'lodash/sample';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LazyChild } from 'react-native-lazy-scrollview';

const NO_LAZY_CHILD_BACKGROUNDS = [
  '#f8a5c2',
  '#f5cd79',
  '#ff7f50',
  '#7bed9f',
  '#1e90ff',
];

const PERCENT = 0.9;
const PERCENT_STRING = `${PERCENT * 100}%`;
const PERCENT_TEXT = `${PERCENT_STRING} not visible`;

export function ColorBlock({
  source,
  nested,
}: {
  source: ImageSourcePropType | null;
  nested?: boolean;
}) {
  const [triggered, setTriggered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const onThresholdPass = () => {
    // Make api call
    setTriggered(true);
  };

  const onVisibilityEnter = () => {
    console.log('ENTER', source?.toString());
    setIsVisible(true);
  };

  const onVisibilityExit = () => {
    console.log('EXIT', source?.toString());
    setIsVisible(false);
  };

  const backgroundColor = useMemo(() => sample(NO_LAZY_CHILD_BACKGROUNDS), []);

  if (!source) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={styles.text}>
          I'm not wrapped in LazyChild so I render right away 😉
        </Text>
      </View>
    );
  }

  if (nested) {
    return (
      <View style={[styles.nested, { backgroundColor }]}>
        <Text style={styles.nestedText}>
          I am not wrapped in LazyChild, but my child is!
        </Text>
        <LazyChild
          onThresholdPass={onThresholdPass}
          onVisibilityEnter={onVisibilityEnter}
          onVisibilityExit={onVisibilityExit}
          percentVisibleThreshold={PERCENT}
        >
          <View style={styles.container}>
            {triggered ? (
              <Image source={source} style={styles.image} />
            ) : (
              <ActivityIndicator />
            )}
            {!isVisible && (
              <View style={styles.percentTextWrapper}>
                <Text style={styles.percentText}>{PERCENT_TEXT}</Text>
              </View>
            )}
          </View>
        </LazyChild>
      </View>
    );
  }

  return (
    <LazyChild
      onThresholdPass={onThresholdPass}
      onVisibilityEnter={onVisibilityEnter}
      onVisibilityExit={onVisibilityExit}
      percentVisibleThreshold={PERCENT}
    >
      <View style={styles.container}>
        {triggered ? (
          <Image source={source} style={styles.image} />
        ) : (
          <ActivityIndicator />
        )}
        {!isVisible && (
          <View style={styles.percentTextWrapper}>
            <Text style={styles.percentText}>{PERCENT_TEXT}</Text>
          </View>
        )}
      </View>
    </LazyChild>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '70%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#d1d8e0',
    alignSelf: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  nested: {
    paddingVertical: 100,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
  },
  nestedText: {
    fontSize: 16,
    textAlign: 'center',
    padding: 16,
    backgroundColor: 'white',
    margin: 16,
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
