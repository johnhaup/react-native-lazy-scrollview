import React, { useCallback, useState } from 'react';

import { random } from 'lodash';
import shuffle from 'lodash/shuffle';
import {
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LazyScrollView } from 'react-native-lazy-scrollview';
import { ColorBlock } from './components/ColorBlock';

const ALBUMS: ImageSourcePropType = [
  require('../assets/albums/american-psycho.jpg'),
  require('../assets/albums/doggstyle.jpg'),
  require('../assets/albums/dude-ranch.jpg'),
  require('../assets/albums/in_utero.jpg'),
  require('../assets/albums/is-this-it.jpg'),
  require('../assets/albums/let-it-be.jpg'),
  require('../assets/albums/rip-this.jpeg'),
  require('../assets/albums/spilt-milk.jpg'),
  require('../assets/albums/suffer.jpg'),
  require('../assets/albums/t-hives.jpg'),
  require('../assets/albums/trendkill.jpg'),
  require('../assets/albums/wysiatwin.jpg'),
  require('../assets/albums/youre-welcome.jpeg'),
  null,
  null,
];

const OFFSET = -100;
const SHUFFLED_ALBUMS = shuffle(ALBUMS);

function VerticalScrollView() {
  const renderBlock = useCallback(
    (source: ImageSourcePropType | null, i: number) => (
      <ColorBlock key={`child_${i}`} source={source} nested={random(1) === 1} />
    ),
    []
  );

  return (
    <View style={styles.scrollviewContainer}>
      <LazyScrollView
        contentContainerStyle={styles.scrollview}
        offset={OFFSET}
        showsVerticalScrollIndicator={false}
      >
        {SHUFFLED_ALBUMS.map(renderBlock)}
      </LazyScrollView>
      <View style={styles.offsetBar}>
        <Text style={styles.offsetText}>{`Offset: ${OFFSET}`}</Text>
      </View>
    </View>
  );
}

function NoContext() {
  const renderBlock = useCallback(
    (source: ImageSourcePropType | null, i: number) => (
      <ColorBlock key={`child_${i}`} source={source} nested={random(1) === 1} />
    ),
    []
  );

  return (
    <ScrollView
      contentContainerStyle={styles.scrollview}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.noContextHeader}>
        These aren't wrapped in a LazyScrollView, so all onThresholdPass and
        onVisibilityEnter callbacks are fired once, on mount
      </Text>
      {SHUFFLED_ALBUMS.map(renderBlock)}
    </ScrollView>
  );
}

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

const PADDING_VERTICAL = 64;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollviewContainer: {
    flex: 1,
    paddingVertical: PADDING_VERTICAL,
  },
  scrollview: {
    paddingHorizontal: 40,
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
  noContextHeader: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: PADDING_VERTICAL * 2,
  },
});
