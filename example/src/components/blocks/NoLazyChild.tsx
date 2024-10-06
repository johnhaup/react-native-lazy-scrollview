import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SQUARE_SIZE } from '../../constants';

export function NoLazyChild() {
  return (
    <View style={styles.container}>
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
    padding: 16,
    backgroundColor: '#7bed9f',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
});
