import { Stack } from 'expo-router';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HorizontalCard } from '../components/cards/HorizontalCard';
import { NoLazyCard } from '../components/cards/NoLazyCard';
import { VerticalCard } from '../components/cards/VerticalCard';

export default function App() {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: top, paddingBottom: bottom }}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.row}>
        <Image source={require('../assets/lazy.png')} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.header} numberOfLines={2}>
            Lazy ScrollView Example App
          </Text>
        </View>
      </View>
      <VerticalCard />
      <HorizontalCard />
      <NoLazyCard />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    padding: 16,
  },
  image: {
    width: Dimensions.get('window').width * 0.3,
    aspectRatio: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'flex-end',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
    textAlign: 'right',
  },
});
