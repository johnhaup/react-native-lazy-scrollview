import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { LazyChild } from 'react-native-lazy-scrollview';
import sample from 'lodash/sample';

const NO_LAZY_CHILD_BACKGROUNDS = [
  '#f8a5c2',
  '#f5cd79',
  '#ff7f50',
  '#7bed9f',
  '#1e90ff',
];

export function ColorBlock({
  uri,
  nested,
}: {
  uri: string | null;
  nested?: boolean;
}) {
  const [triggered, setTriggered] = useState(false);

  const onThresholdPass = () => {
    // Make api call
    setTriggered(true);
  };

  const backgroundColor = sample(NO_LAZY_CHILD_BACKGROUNDS);

  if (!uri) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={styles.text}>
          I'm not wrapped in LazyChild so I render right away 😉
        </Text>
      </View>
    );
  }

  const aspectRatio = triggered ? 1 / 2 : 1;

  if (nested) {
    return (
      <View style={[styles.nested, { backgroundColor }]}>
        <Text style={styles.text}>
          I am not wrapped in LazyChild, but my child is!
        </Text>
        <LazyChild onThresholdPass={onThresholdPass}>
          <View style={[styles.container, { aspectRatio }]}>
            {triggered ? (
              <Image source={{ uri }} style={styles.image} />
            ) : (
              <ActivityIndicator />
            )}
          </View>
        </LazyChild>
      </View>
    );
  }

  return (
    <LazyChild onThresholdPass={onThresholdPass}>
      <View style={[styles.container, { aspectRatio }]}>
        {triggered ? (
          <Image source={{ uri }} style={styles.image} />
        ) : (
          <ActivityIndicator />
        )}
      </View>
    </LazyChild>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
    backgroundColor: '#d1d8e0',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
  image: { width: '100%', height: '100%' },
  nested: {
    paddingVertical: 100,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
  },
  nestedText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
