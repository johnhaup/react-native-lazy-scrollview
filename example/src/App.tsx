import React from 'react';

import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LazyScrollView } from 'react-native-lazy-scrollview';
import { ColorBlock } from './components/ColorBlock';
import shuffle from 'lodash/shuffle';
import { random } from 'lodash';

const ALBUMS = [
  'https://audioxide.com/api/images/album-artwork/in-utero-nirvana-medium-square.jpg',
  'https://audioxide.com/api/images/album-artwork/pinkerton-weezer-medium-square.jpg',
  'https://static1.squarespace.com/static/55b7b1bde4b0828f7d1438de/t/6091766fa1c5b50917511c4b/1620145812302/WAVVES+-+Hideaway+-+Album+Cover+3000x3000.jpg?format=1500w',
  'https://i.scdn.co/image/ab67616d0000b27313f2466b83507515291acce4',
  'https://m.media-amazon.com/images/I/515NY3NS1EL._UF1000,1000_QL80_.jpg',
  'https://images.squarespace-cdn.com/content/v1/5e270e203c421657bd3e3208/1584536470858-1OSWN7WUQ3DY749LGHOU/R-1843384-1282324049.jpeg.jpg',
  null,
  'https://m.media-amazon.com/images/I/61vMlYT58HL._UF1000,1000_QL80_.jpg',
  'https://e.snmc.io/i/1200/s/9a0f51b8b776171aaee65c1a352f6d11/2396429',
  'https://global-uploads.webflow.com/5fda4244c42e015b06d2fd8d/5fdbca8f15a8ee0f0f369767_cover.jpg',
  'https://i.discogs.com/GXyIsX5gBpgw3XMtEZ-FvyVJBDZyk7Aoq-bPzV_yIXk/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTIyNDY1/MTUtMTI5OTE5MjI1/NS5qcGVn.jpeg',
  null,
];

const OFFSETS = [-100, -500];

export default function App() {
  const renderBlock = (uri: string | null, i: number) => (
    <ColorBlock key={`child_${i}`} uri={uri} nested={random(1) === 1} />
  );

  const renderScrollView = (offset: number) => (
    <View key={`${offset}`} style={styles.scrollviewContainer}>
      <LazyScrollView
        contentContainerStyle={styles.scrollview}
        offset={offset}
        showsVerticalScrollIndicator={false}
      >
        {shuffle(ALBUMS).map(renderBlock)}
      </LazyScrollView>
      <View style={styles.offsetBar}>
        <Text style={styles.offsetText}>{`Offset ${offset}`}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView horizontal pagingEnabled>
      {OFFSETS.map(renderScrollView)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollviewContainer: {
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width * 0.5,
    paddingHorizontal: 8,
  },
  scrollview: {
    // paddingVertical: 40,
  },
  offsetBar: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    opacity: 0.7,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offsetText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
