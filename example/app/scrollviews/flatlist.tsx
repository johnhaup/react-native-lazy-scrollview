import React, { useCallback, useRef } from 'react';
import {
  ImageSourcePropType,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  LazyFlatList,
  LazyFlatListMethods,
} from 'react-native-lazy-scrollview';
import { ALBUMS, PADDING_VERTICAL } from '../../constants';
import shuffle from 'lodash/shuffle';
import { FireOnceBlock } from '../../components/blocks/FireOnceBlock';
import { ImageBlock } from '../../components/blocks/ImageBlock';
import { NoLazyChild } from '../../components/blocks/NoLazyChild';
import { Header } from '../../components/blocks/Header';

const OFFSET = -50;

type Block = ImageSourcePropType | 'no-lazy' | 'fire-once';

export default function FlatList() {
  const ref = useRef<LazyFlatListMethods>(null);

  const data: Block[] = shuffle(
    ALBUMS.concat(shuffle(ALBUMS)).concat(shuffle(ALBUMS))
  );

  const renderItem = useCallback(
    ({ item: source, index }: ListRenderItemInfo<Block>) => {
      if (source === 'no-lazy') {
        return <NoLazyChild key={`no-lazy-child-${index}`} />;
      }

      if (source === 'fire-once') {
        return (
          <FireOnceBlock
            key={`fire-once-child-${index}`}
            percentVisibleThreshold={1}
            debug
          />
        );
      }

      return (
        <ImageBlock
          key={`${source.toString()}-${index}`}
          source={source}
          percentVisibleThreshold={1}
          debug
        />
      );
    },
    []
  );

  return (
    <View style={styles.scrollviewContainer}>
      <LazyFlatList
        ref={ref}
        offset={OFFSET}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        ListHeaderComponent={Header}
        data={data}
        renderItem={renderItem}
        debug
      />
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
    </View>
  );
}

const styles = StyleSheet.create({
  scrollviewContainer: {
    flex: 1,
    backgroundColor: '#ecf0f1',
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
    top: 8,
    right: 8,
    position: 'absolute',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  arrowButton: { marginBottom: 8 },
  arrow: { fontSize: 32 },
});
