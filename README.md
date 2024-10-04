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

Example: Say you have some components lower in your scoll that make expensive api calls. Give them a skeleton loader, make your threshold `300`, and trigger your api call when the component is within `300` px of the bottom of the `ScrollView` by passing `yourApiCall` to the `onEnterThresholdPass` prop on the `LazyChild` that wraps your component. And then say you're like "yeah but I also want to know when 75% of this api-heavy component is viewable". Then set the `percentVisibleThreshold` on the LazyChild wrapping that sucker to `0.75`, then trigger and analytic call with `onVisibilityEnter`! This will fire every time the component leaves or enters. It has `onVisibilityExit`, which you can use if you're feeling super froggy and want to pause a video when it goes under a certain percentage of viewable area, and if then you can use `onExitThresholdPass` to unmount the video and replace it with a spacer.

#### Notes

- If a `LazyChild` does not have a `LazyScrollview` ancestor, it will fire its `onEnterThresholdPass` and `onVisibilityEnter` on mount.
- `scrollEventThrottle` defaults to 16.

#### ⚠️ Limitations

Currently only supports vertical ScrollView.

## Installation

```sh
yarn add react-native-lazy-scrollview
```

This library requires reanimated. Follow their [installation instructions](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation).

[API Documentation](https://johnhaup.github.io/react-native-lazy-scrollview/)

## Usage Examples

```js
// MyCoolHomeScreen.tsx
import { LazyScrollView } from 'react-native-lazy-scrollview';
import {
  CoolComponentA,
  CoolComponentB,
  CoolComponentC,
  PriceMasterVideo,
  ScrollToTopButton,
} from './components';

export function MyCoolHomeScreen() {
  const ref = useRef<LazyScrollViewMethods>(null);

  return (
    // Trigger onThresholdReached when child is 300 pixels below the bottom
    <LazyScrollView offset={300} showsVerticalScrollIndicator={false}>
      <CoolComponentA />
      <PriceMasterVideo />
      <CoolComponentB />
      <CoolComponentC />
      <ScrollToTopButton
        onPress={() => ref.current?.scrollToStart({ animated: true })}
      />
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

  const onEnterThresholdPass = async () => {
    try {
      const fetchedData = await someExpensiveApiCall();
      setData(fetchedData);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  // Fired when LazyChild has 75% visibility
  const onVisibilityEnter = async () => {
    analyticsCall();
    setPaused(false);
  };

  if (!data) {
    // Trigger has fired and no data :(
    return null;
  }

  return (
    <LazyChild
      onEnterThresholdPass={onEnterThresholdPass}
      onVisibilityEnter={onVisibilityEnter}
      percentVisibleThreshold={0.75}
    >
      {loading ? <SkeletonLoader /> : <ContentView data={data} />}
    </LazyChild>
  );
}

// PriceMasterVideo.tsx
import { View } from 'react-native';
import { LazyChild } from 'react-native-lazy-scrollview';
import { ContentView, SkeletonLoader, VideoPlayer } from './components';

const videoURl = 'https://youtu.be/wfJnni0oBPE?si=kRdIUcq4l5dfGfqV';

export function PriceMasterVideo() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(true);

  const onEnterThresholdPass = async () => {
    setLoading(false);
  };

  // Fired when LazyChild has 25% visibility
  const onVisibilityEnter = async () => {
    analyticsCall();
    setPaused(false);
  };

  // Fired when LazyChild is less that 25% visible after being visible
  const onVisibilityExit = async () => {
    setPaused(true);
  };

  return (
    <LazyChild
      onEnterThresholdPass={onEnterThresholdPass}
      onVisibilityEnter={onVisibilityEnter}
      percentVisibleThreshold={0.25}
    >
      {loading ? (
        <SkeletonLoader />
      ) : (
        <VideoPlayer paused={paused} videoUrl={videoUrl} />
      )}
    </LazyChild>
  );
}
```

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
