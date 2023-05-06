<div align="center">
  <h1>react-native-lazy-scrollview</h1>
  <a href="https://www.youtube.com/watch?v=3jqTqrGtGjg">
    <img alt="lazy man" width=150 src="lazy.svg">
  </a>
  <p>Lazy ScrollView for React Native.</p>
</div>
<hr />

[![CI](https://github.com/johnhaup/react-native-lazy-scrollview/actions/workflows/ci.yml/badge.svg)](https://github.com/johnhaup/react-native-lazy-scrollview/actions/workflows/ci.yml)

## Motivation

To provide an easy way to trigger logic when a child of a `ScrollView` passes a threshold scroll value.

<img alt="demo" src="https://media1.giphy.com/media/8JpkAsi9FOX763FIEB/giphy.gif" width="222" height="480" />

## Installation

```sh
yarn add react-native-lazy-scrollview
```

This library requires reanimated. Follow their [installation instructions](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation).

## Usage

```js
// MyCoolHomeScreen.tsx
import { SafeAreaView } from 'react-native';
import { LazyScrollView } from 'react-native-lazy-scrollview';
import { CoolComponentA, CoolComponentB, CoolComponentC } from './components';

export function MyCoolHomeScreen() {
  return (
    <SafeAreaView>
      // Trigger onThresholdReached when child is 100 pixels above the bottom
      <LazyScrollView offset={-100} showsVerticalScrollIndicator={false}>
        <CoolComponentA />
        <CoolComponentB />
        <CoolComponentC />
      </LazyScrollView>
    </SafeAreaView>
  );
}

// CoolComponentC.tsx
import { View } from 'react-native';
import { LazyChild } from 'react-native-lazy-scrollview';
import { ContentView, SkeletonLoader } from './components';

export function CoolComponentC() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const onThresholdPass = async () => {
    try {
      const fetchedData = await someExpensiveApiCall();
      setData(fetchedData);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  if (!loading && !data) {
    return null; // Or maybe some error state if you're feeling fancy
  }

  return (
    <LazyChild onThresholdPass={onThresholdPass}>
      {loading ? <SkeletonLoader /> : <ContentView data={data} />}
    </LazyChild>
  );
}
```

## API

**LazyScrollView**
| Prop | Type | Optional | Default | Description |
| --- | --- | --- | --- | --- |
| offset | `number` | Yes | 0 (bottom of ScrollView) | How far above or below the bottom of the `ScrollView` the threshold trigger is. Negative is above, positive it below.

**LazyChild**
| Prop | Type | Optional | Default | Description |
| --- | --- | --- | --- | --- |
| onThresholdPass | `function` | No | - | Callback that will fire when top of `View` passes threshold trigger.

## Example

To run the example app, clone the repo

```bash
cd example
yarn install

yarn ios
# or
yarn android
```

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
