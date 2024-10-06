import React, { useState } from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NoContext } from './components/scrollviews/NoContext';
import { VerticalScrollView } from './components/scrollviews/VerticalScrollView';

const demoTypes = ['vertical', 'nocontext'] as const;
type DemoType = (typeof demoTypes)[number];

export default function App() {
  const [type, setType] = useState<DemoType>();

  const renderButton = (text: DemoType) => {
    const onPress = () => {
      setType(text);
    };

    const active = type === text;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={styles.button}
        key={text}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>
          {active ? '✅' : ''}
          {text}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {type === 'vertical' && <VerticalScrollView />}
      {type === 'nocontext' && <NoContext />}
      <View style={styles.buttonContainer}>{demoTypes.map(renderButton)}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
