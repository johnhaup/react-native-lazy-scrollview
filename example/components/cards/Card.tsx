import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { VERTICAL } from '../../constants';

export function Card({
  scrollView,
  animatedStyle,
  imageOnBottom,
}: {
  scrollView: typeof VERTICAL;
  animatedStyle: ViewStyle;
  imageOnBottom?: boolean;
}) {
  const router = useRouter();

  const onPress = () => {
    router.push(`scrollviews/${scrollView.name}`);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor: scrollView.color }]}
      key={scrollView.name}
      activeOpacity={0.7}
    >
      {imageOnBottom ? (
        <>
          <View style={styles.textContainer}>
            <Text style={styles.buttonTitle}>{scrollView.title}</Text>
            <Text style={styles.buttonText}>{scrollView.description}</Text>
          </View>
          <View>
            <Animated.View style={[styles.icon, animatedStyle]}>
              <Image source={scrollView.image} style={styles.image} />
            </Animated.View>
          </View>
        </>
      ) : (
        <>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ justifyContent: 'center' }}>
              <Animated.View style={[styles.icon, animatedStyle]}>
                <Image source={scrollView.image} style={styles.image} />
              </Animated.View>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.buttonTitle}>{scrollView.title}</Text>
              <Text style={styles.buttonText}>{scrollView.description}</Text>
            </View>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    padding: 16,
  },
  button: {
    padding: 16,
    borderRadius: 16,
    marginVertical: 8,
  },
  buttonTitle: {
    color: 'white',
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 18,
  },
  icon: {
    padding: 12,
    borderRadius: 64,
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  image: {
    width: 24,
    height: 24,
  },
  textContainer: {
    flex: 1,
  },
});
