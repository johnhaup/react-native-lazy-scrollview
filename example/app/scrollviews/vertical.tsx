import { useRef } from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  LazyScrollView,
  LazyScrollViewMethods,
} from 'react-native-lazy-scrollview';
import { PADDING_VERTICAL } from '../../constants';
import { Blocks } from '../../components/blocks/Blocks';

const OFFSET = -50;

export default function VerticalScrollView() {
  const ref = useRef<LazyScrollViewMethods>(null);

  return (
    <View style={styles.scrollviewContainer}>
      <LazyScrollView
        ref={ref}
        offset={OFFSET}
        showsVerticalScrollIndicator={false}
      >
        <Blocks />
      </LazyScrollView>
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
