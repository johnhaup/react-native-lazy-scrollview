import React, { useCallback, useEffect } from 'react';

import { random } from 'lodash';
import shuffle from 'lodash/shuffle';
import compact from 'lodash/compact';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
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

export default function App() {
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

const PADDING_VERTICAL = 64;

const styles = StyleSheet.create({
  scrollviewContainer: {
    flex: 1,
    paddingVertical: PADDING_VERTICAL,
    borderWidth: 1,
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
    alignItems: 'center',
  },
  offsetText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    backgroundColor: '#000',
    padding: 8,
  },
});
