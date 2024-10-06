import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SQUARE_SIZE } from '../../constants';
import { sample } from 'lodash';

const NO_LAZY_CHILD_BACKGROUNDS = [
  '#f8a5c2',
  '#f5cd79',
  '#ff7f50',
  '#7bed9f',
  '#1e90ff',
];

export function NoLazyChild() {
  const backgroundColor = useMemo(() => sample(NO_LAZY_CHILD_BACKGROUNDS), []);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.text}>
        I'm not wrapped in LazyChild so I render right away 😉
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
});
