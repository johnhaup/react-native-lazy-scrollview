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

To provide an easy way to trigger logic when a child (or nested child) of a `ScrollView` passes a threshold scroll value. This is useful when you have a screen with dynamic content that you don't want to unmount when it scrolls offscreen, but also would like to lazy load. Also provides ability to trigger additional logic when a percentage of your component is visible in the `ScrollView`.

<img alt="demo" src="./__tests__/demo.gif" width=300 height=649/>

#### ⚠️ Limitations

Currently only supports vertical ScrollView.

## Installation

```sh
yarn add react-native-lazy-scrollview
```

This library requires reanimated. Follow their [installation instructions](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation).

## Usage

```js
// MyCoolHomeScreen.tsx
import { LazyScrollView } from 'react-native-lazy-scrollview';
import { CoolComponentA, CoolComponentB, CoolComponentC } from './components';

export function MyCoolHomeScreen() {
  return (
    // Trigger onThresholdReached when child is 100 pixels above the bottom
    <LazyScrollView offset={-100} showsVerticalScrollIndicator={false}>
      <CoolComponentA />
      <CoolComponentB />
      <CoolComponentC />
    </LazyScrollView>
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

  const onPercentVisibleThresholdPass = async () => {
    analyticsCall();
  };

  if (!data) {
    return null;
  }

  return (
    <LazyChild
      onThresholdPass={onThresholdPass}
      onPercentVisibleThresholdPass={onPercentVisibleThresholdPass}
      percentVisibleThreshold={0.75}
    >
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
| percentVisibleThreshold | `number` (Unit Interval) | Yes | - | Percentage of LazyChild that will trigger `onPercentVisibleThresholdPass`.
| onPercentVisibleThresholdPass | `function` | Yes | - | Callback that will fire when `percentVisibleThreshold` is visible above bottom of LazyScrollView.

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
