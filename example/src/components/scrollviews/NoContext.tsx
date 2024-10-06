import React from 'react';

import { ScrollView, StyleSheet, Text } from 'react-native';
import { BlockColumns } from './BlockColumns';

export function NoContext() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.noContextHeader}>
        These aren't wrapped in a LazyScrollView, so all onThresholdPass and
        onVisibilityEnter callbacks are fired once, on mount
      </Text>
      <BlockColumns />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  noContextHeader: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    padding: 16,
    marginTop: 80,
  },
});
