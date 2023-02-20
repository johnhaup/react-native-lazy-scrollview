# react-native-lazy-scrollview

Lazy ScrollView for React Native brah

## Motivation
Make it easy to toggle components into an "active" state based on their position in a scrollview.  This differs from lazy loading more content in a list, as i wanted the user to be able to scroll a view and see loaders, but only run the api calls (or any other conditional render logic) if those views passed a certain threshold on scroll.

## Installation
```sh
yarn add react-native-lazy-scrollview
```
This library requires reanimated.  Follow their [installtion instructions](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation).



## Usage

```js
// MyCoolHomeScreen.tsx
import { SafeAreaView } from 'react-native';
import { LazyScrollView } from 'react-native-lazy-scrollview';
import {
  CoolComponentA,
  CoolComponentB,
  CoolComponentC,
} from './components'

export function MyCoolHomeScreen() {
  return (
    <SafeAreaView>
      <LazyScrollView offset={-400}>
        <CoolComponentA />
        <CoolComponentB />
        <CoolComponentC />
      </LazyScrollView>
    </SafeAreaView>
  )
}

// CoolComponentC.tsx
import { View } from 'react-native';
import { LazyChild } from 'react-native-lazy-scrollview';

function Content({ data }) {
  return (
    <View>
      // A Cool Component that uses data
    </View>
  )
}

function SkeletonLoader() {
  return // Loader componen
}


export function CoolComponentC() {
  const [data, setData] = useState(false);
  const [loading, setLoading] = useState(true);

  const onThresholdPass = async () => {
    try {
      const fetchedData = await someExpensiveApiCall();
      setData(fetchedData);
      setLoading(false);
    } catch(e) {
      setLoading(false);
    }
  };

  return (
    <LazyChild onThresholdPass={onThresholdPass}>
      {
        loading ? <SkeletonLoader /> : <Content data={data} />
      }
    </LazyChild>
  );
}
```

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
