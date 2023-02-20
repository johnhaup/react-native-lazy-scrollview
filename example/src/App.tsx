import React, { useState } from 'react';
import { Dimensions, SafeAreaView, Text, View } from 'react-native';
import { LazyChild, LazyScrollView } from 'react-native-lazy-scrollview';

type Child = {
  name: string;
  height: number;
  backgroundColor: string;
};

const COMPS = [
  { name: 'one', height: 400, backgroundColor: 'red' },
  { name: 'two', height: 800, backgroundColor: 'blue' },
  { name: 'three', height: 200, backgroundColor: 'yellow' },
  { name: 'four', height: 500, backgroundColor: 'green' },
  { name: 'five', height: 400, backgroundColor: 'pink' },
];

function ColorBlock({
  name,
  height: injectHeight,
  backgroundColor: injected,
}: Child) {
  const [backgroundColor, setBgColor] = useState(injected);
  const [height, setHeight] = useState(injectHeight);

  const onThresholdPass = () => {
    setBgColor('gray');
    setHeight(injectHeight * 3);
  };

  return (
    <LazyChild onThresholdPass={onThresholdPass}>
      <View
        style={{
          width: Dimensions.get('screen').width,
          height,
          backgroundColor,
        }}
      >
        <Text>{name}</Text>
      </View>
    </LazyChild>
  );
}

export const App = () => {
  const renderItem = (props: Child, index: number) => {
    return <ColorBlock key={`anim-child-${index}`} {...props} />;
  };

  return (
    <SafeAreaView>
      <LazyScrollView offset={-400}>{COMPS.map(renderItem)}</LazyScrollView>
    </SafeAreaView>
  );
};
