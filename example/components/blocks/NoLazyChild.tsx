import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SQUARE_SIZE } from '../../constants';

export function NoLazyChild() {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.text}>
          I'm not wrapped in LazyChild so I render right away 😉
        </Text>
      </View>
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
    backgroundColor: '#ff7f50',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
});
