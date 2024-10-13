import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Blocks } from '../../components/blocks/Blocks';

export default function NoContext() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.scrollviewContainer}
    >
      <Blocks />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollviewContainer: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
});
