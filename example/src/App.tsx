import React, { useState } from 'react';

import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LazyChild, LazyScrollView } from 'react-native-lazy-scrollview';

type Child = {
  name: string;
  height: number;
  backgroundColor: string;
};

const COMPS = [
  { name: 'Green', height: 400, backgroundColor: '#26de81' },
  { name: 'Yellow', height: 400, backgroundColor: '#fed330' },
  { name: 'Blue', height: 400, backgroundColor: '#45aaf2' },
  { name: 'Purple', height: 400, backgroundColor: '#a55eea' },
  { name: 'Red', height: 400, backgroundColor: '#eb3b5a' },
  { name: 'Orange', height: 400, backgroundColor: '##fd9644' },
];

function ColorBlock({ name, height, backgroundColor }: Child) {
  const [triggered, setTriggered] = useState(false);

  const onThresholdPass = () => {
    setTriggered(true);
  };

  const style = {
    height,
    backgroundColor: triggered ? backgroundColor : '#d1d8e0',
  };

  return (
    <LazyChild onThresholdPass={onThresholdPass}>
      <View style={[styles.childContainer, style]}>
        <Text style={styles.childText}>{name}</Text>
        {triggered && <Text style={styles.childText}>Fetched!</Text>}
      </View>
    </LazyChild>
  );
}

export default function App() {
  const renderBlock = (child: Child) => (
    <ColorBlock key={child.name} {...child} />
  );

  return (
    <LazyScrollView offset={-400}>{COMPS.map(renderBlock)}</LazyScrollView>
  );
}

const styles = StyleSheet.create({
  childContainer: {
    width: Dimensions.get('screen').width - 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 8,
  },
  childText: {
    fontSize: 24,
    fontWeight: '600',
  },
});
