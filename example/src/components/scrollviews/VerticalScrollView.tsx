import React, { useRef } from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  LazyScrollView,
  LazyScrollViewMethods,
} from 'react-native-lazy-scrollview';
import { PADDING_VERTICAL } from '../../constants';
import { BlockColumns } from './BlockColumns';

const OFFSET = -100;

export function VerticalScrollView() {
  const ref = useRef<LazyScrollViewMethods>(null);

  return (
    <View style={styles.scrollviewContainer}>
      <LazyScrollView
        ref={ref}
        offset={OFFSET}
        showsVerticalScrollIndicator={false}
      >
        <BlockColumns />
      </LazyScrollView>
      <View style={styles.arrowsContainer}>
        <TouchableOpacity
          style={styles.arrowButton}
          activeOpacity={0.7}
          onPress={() => ref.current?.scrollToStart({ animated: true })}
        >
          <Text style={styles.arrow}>⬆️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => ref.current?.scrollToEnd({ animated: true })}
        >
          <Text style={styles.arrow}>⬇️</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.offsetBar}>
        <Text style={styles.offsetText}>{`Offset: ${OFFSET}`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollviewContainer: {
    flex: 1,
    paddingVertical: PADDING_VERTICAL,
    backgroundColor: '#2d3436',
  },
  offsetBar: {
    position: 'absolute',
    bottom: OFFSET * -1 + PADDING_VERTICAL,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    left: 0,
    right: 0,
    opacity: 0.7,
    height: 50,
    justifyContent: 'flex-end',
  },
  offsetText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    backgroundColor: '#000',
    padding: 8,
    alignSelf: 'flex-start',
  },
  arrowsContainer: {
    top: 0,
    bottom: 0,
    right: 0,
    position: 'absolute',
    justifyContent: 'center',
  },
  arrowButton: { marginBottom: 8 },
  arrow: { fontSize: 32 },
});
