import { chunk } from 'lodash';
import shuffle from 'lodash/shuffle';
import React, { useCallback } from 'react';
import {
  Dimensions,
  ImageSourcePropType,
  StyleSheet,
  View,
} from 'react-native';
import { ALBUMS, SQUARE_SIZE } from '../../constants';
import { FireOnceBlock } from '../blocks/FireOnceBlock';
import { ImageBlock } from '../blocks/ImageBlock';
import { NoLazyChild } from '../blocks/NoLazyChild';

export function Blocks({ horizontal }: { horizontal?: boolean }) {
  const chunks = chunk(
    shuffle(ALBUMS.concat(shuffle(ALBUMS)).concat(shuffle(ALBUMS))),
    9
  );

  const renderBlock = useCallback(
    (source: ImageSourcePropType | 'no-lazy' | 'fire-once', index: number) => {
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

  const renderRow = (
    column: (ImageSourcePropType | 'no-lazy' | 'fire-once')[],
    index: number
  ) => {
    return (
      <View
        key={`column-${index}`}
        style={[
          styles.container,
          index % 2 === 0 ? styles.offsetHorizontal : {},
        ]}
      >
        {column.map(renderBlock)}
      </View>
    );
  };

  return horizontal ? (
    <View style={[{ width: Dimensions.get('window').width * 4 }]}>
      {chunks.map(renderRow)}
    </View>
  ) : (
    <View style={styles.container}>
      <View>{shuffle(ALBUMS).map(renderBlock)}</View>
      <View>
        <View style={styles.offset}>{shuffle(ALBUMS).map(renderBlock)}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  offset: {
    transform: [{ translateY: -SQUARE_SIZE / 2 }],
  },
  offsetHorizontal: {
    transform: [{ translateX: -SQUARE_SIZE / 2 }],
  },
});
