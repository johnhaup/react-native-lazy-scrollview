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

export function ColorBlock({ uri }: { uri: string | null }) {
  const [triggered, setTriggered] = useState(false);

  const onThresholdPass = () => {
    // Make api call
    setTriggered(true);
  };

  if (!uri) {
    const backgroundColor = sample(NO_LAZY_CHILD_BACKGROUNDS);

    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={styles.text}>
          I'm not wrapped in LazyChild so I render right away 😉
        </Text>
      </View>
    );
  }

  return (
    <LazyChild onThresholdPass={onThresholdPass}>
      <View style={styles.container}>
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
  image: { aspectRatio: 1, width: '100%' },
});
