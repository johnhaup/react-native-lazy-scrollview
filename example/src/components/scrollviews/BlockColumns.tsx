import React, { useCallback } from 'react';

import shuffle from 'lodash/shuffle';
import { ImageSourcePropType, StyleSheet, View } from 'react-native';
import { ALBUMS, SQUARE_SIZE } from '../../constants';
import { ImageBlock } from '../blocks/ImageBlock';
import { NoLazyChild } from '../blocks/NoLazyChild';

export function BlockColumns() {
  const renderBlock = useCallback(
    (source: ImageSourcePropType | null, index: number) => {
      if (source === null) {
        return <NoLazyChild key={`no-lazy-child-${index}`} />;
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
