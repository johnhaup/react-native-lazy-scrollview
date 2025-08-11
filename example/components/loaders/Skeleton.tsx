import React, { ReactElement } from 'react';
import { View, StyleSheet, LayoutRectangle } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import Reanimated, {
  useSharedValue,
  withRepeat,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

interface SkeletonProps {
  background?: string;
  highlight?: string;
  children: ReactElement;
  show?: boolean;
}

const BaseSkeleton: React.FC<SkeletonProps> = ({
  children,
  background = '#636e72',
  highlight = '#b2bec3',
}) => {
  const [layout, setLayout] = React.useState<LayoutRectangle>();
  const shared = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => {
    const x = interpolate(
      shared.value,
      [0, 1],
      [layout ? -layout.width : 0, layout ? layout.width : 0]
    );
    return {
      transform: [{ translateX: x }],
    };
  });

  React.useEffect(() => {
    shared.value = withRepeat(withTiming(1, { duration: 1000 }), Infinity);
  }, [shared]);

  if (!layout) {
    return (
      <View onLayout={(event) => setLayout(event.nativeEvent.layout)}>
        {children}
      </View>
    );
  }

  return (
    <MaskedView
      maskElement={children}
      style={{ width: layout.width, height: layout.height }}
    >
      <View style={[styles.container, { backgroundColor: background }]} />
      <Reanimated.View style={[StyleSheet.absoluteFill, animStyle]}>
        <MaskedView
          style={StyleSheet.absoluteFill}
          maskElement={
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
              colors={['transparent', highlight, 'transparent']}
            />
          }
        >
          <View
            style={[StyleSheet.absoluteFill, { backgroundColor: highlight }]}
          />
        </MaskedView>
      </Reanimated.View>
    </MaskedView>
  );
};

export const Skeleton = ({ children, show, ...rest }: SkeletonProps) => {
  if (!show) {
    return children;
  }

  return <BaseSkeleton {...rest}>{children}</BaseSkeleton>;
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    overflow: 'hidden',
  },
});
