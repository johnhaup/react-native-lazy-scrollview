import React, { useCallback } from 'react';

import shuffle from 'lodash/shuffle';
import { ImageSourcePropType, StyleSheet, View } from 'react-native';
import { ALBUMS, SQUARE_SIZE } from '../../constants';
import { ImageBlock } from '../blocks/ImageBlock';
import { NoLazyChild } from '../blocks/NoLazyChild';
import { FireOnceBlock } from '../blocks/FireOnceBlock';

export function BlockColumns() {
  const renderBlock = useCallback(
    (source: ImageSourcePropType | 'no-lazy' | 'fire-once', index: number) => {
      if (source === 'no-lazy') {
        return <NoLazyChild key={`no-lazy-child-${index}`} />;
      }

      if (source === 'fire-once') {
        return (
          <FireOnceBlock
            key={`fire-once-child-${index}`}
            percentVisibleThreshold={0.9}
          />
        );
      }

      return (
        <ImageBlock
          key={source.toString()}
          source={source}
          percentVisibleThreshold={0.9}
        />
      );
    },
    []
  );

  return (
    <View style={styles.container}>
      <View>{shuffle(ALBUMS).map(renderBlock)}</View>
      <View>
        <View style={{ height: SQUARE_SIZE / 2 }} />
        <View>{shuffle(ALBUMS).map(renderBlock)}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});
