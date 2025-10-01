<div align="center">
  <h1>react-native-lazy-scrollview</h1>
  <a href="https://www.youtube.com/watch?v=3jqTqrGtGjg">
    <img alt="lazy man" width=150 src="lazy.svg">
  </a>
  <p>Lazy Scrollers for React Native.</p>
</div>
<hr />

[![CI](https://github.com/johnhaup/react-native-lazy-scrollview/actions/workflows/ci.yml/badge.svg)](https://github.com/johnhaup/react-native-lazy-scrollview/actions/workflows/ci.yml)

Provides an api to react to allow child components of `ScrollView` or `FlatList` to easily manage their visibility states on their own, instead of at a list level. This is done by measuring children on the UI thread and only firing back to JS when a defined threshold has been passed.

## Installation

```sh
yarn add react-native-lazy-scrollview
```

This library requires reanimated. Follow their [installation instructions](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation).

## Getting Started

1. Swap out `ScrollView` or `Flatlist` for `LazyScrollView` or `LazyFlatlist`.
2. Wrap any child of the list that you'd like to react to visibility in `LazyChild`.
3. Define `LazyChild`'s callbacks. `entering/exiting` callbacks fire when the child passes the parent list's threshold when compared to its edge (default is 0, meaning top and bottom of the list). `visibility` callbacks fire when the child has its `percentVisibleThreshold` met (defaults to `1`, or 100%). You can add a `minimumVisibilityMs` value to delay/prevent firing a `visbility` callback until it has been visible for a certain amount of time.

#### Notes

- If a `LazyChild` does not have a `LazyScrollview/LazyFlatlist` ancestor, it will fire its `onEnterThresholdPass` and `onVisibilityEnter` on mount.
- If a corresponding 'exit' callback is not provided for an 'enter' callback, after the 'enter' callback fires, measuring stops for that callback.
- `scrollEventThrottle` defaults to 16.

## API

#### LazyScrollView

##### Props

_Extends [ScrollView props](https://reactnative.dev/docs/scrollview), omitting `onLayout` and `ref` (see below)._

| Name       | Type                                      | Required | Description                                                                                                                                                    |
| ---------- | ----------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **offset** | `number`                                  | No       | How far above or below the bottom of the `ScrollView` the threshold trigger is. Negative = above, positive = below. **Default:** `0` (bottom of `ScrollView`). |
| **ref**    | `MutableRefObject<LazyScrollViewMethods>` | No       | Ref to the `LazyScrollView`. Exposes `scrollTo`, `scrollToStart`, and `scrollToEnd` methods.                                                                   |
| **debug**  | `boolean`                                 | No       | When `true`, logs measurement data for debugging. Logs are disabled in production.                                                                             |

##### Methods

| Method            | Type                                                                            | Description                       |
| ----------------- | ------------------------------------------------------------------------------- | --------------------------------- |
| **scrollTo**      | Maps to [ScrollView scrollTo](https://reactnative.dev/docs/scrollview#scrollto) | Scrolls to a specific x/y offset. |
| **scrollToStart** | `(options?: { animated: boolean }): void`                                       | Scrolls to the start of the list. |
| **scrollToEnd**   | `(options?: { animated: boolean }): void`                                       | Scrolls to the end of the list.   |

#### LazyFlatlist

##### Props

_Extends [Flatlist props](https://reactnative.dev/docs/flatlist), omitting `onLayout` and `ref` (see below)._
| Name | Type | Required | Description |
| ---------- | ---------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **offset** | `number` | No | How far above or below the bottom of the `FlatList` the threshold trigger is. Negative = above, positive = below. **Default:** `0` (bottom of `FlatList`). |
| **ref** | `MutableRefObject<LazyFlatListMethods \| null>` | No | Ref to the `LazyFlatList`. Exposes `scrollToStart`, `scrollToEnd`, `scrollToIndex`, `scrollToOffset`, and `scrollToItem` methods. |
| **debug** | `boolean` | No | When `true`, logs measurement data for debugging. Logs are disabled in production. |

##### Methods

| Method             | Type                                                                                    | Description                                    |
| ------------------ | --------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **scrollToStart**  | `(options?: { animated: boolean }): void`                                               | Scrolls to the start (top/left) of the list.   |
| **scrollToEnd**    | `(options?: { animated: boolean }): void`                                               | Scrolls to the end (bottom/right) of the list. |
| **scrollToIndex**  | Maps to [Flatlist scrollToIndex](http://reactnative.dev/docs/flatlist#scrolltoindex)    | Scrolls to the item at the given index.        |
| **scrollToOffset** | Maps to [Flatlist scrollToOffset](https://reactnative.dev/docs/flatlist#scrolltooffset) | Scrolls to a specific offset.                  |
| **scrollToItem**   | Maps to [Flatlist scrollToItem](https://reactnative.dev/docs/flatlist#scrolltoitem)     | Scrolls to a specific item.                    |

#### LazyChild

##### Props

| Name                        | Type              | Required | Description                                                                                                                                                 |
| --------------------------- | ----------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **onEnterThresholdPass**    | `() => void`      | No       | Fires when the child passes the scroll offset **after being offscreen**. Only fires once and stops measuring if `onExitThresholdPass` is not provided.      |
| **onExitThresholdPass**     | `() => void`      | No       | Fires when the child passes the scroll offset **after being onscreen**. Will not fire if `onEnterThresholdPass` has not fired.                              |
| **onVisibilityEnter**       | `() => void`      | No       | Fires when the child’s viewable area exceeds the `percentVisibleThreshold`. Only fires once and stops measuring if `onVisibilityExit` is not provided.      |
| **onVisibilityExit**        | `() => void`      | No       | Fires when the child’s viewable area goes under the `percentVisibleThreshold` **after being above it**. Will not fire if `onVisibilityEnter` has not fired. |
| **children**                | `React.ReactNode` | Yes      | The child component(s) to wrap.                                                                                                                             |
| **percentVisibleThreshold** | `number`          | No       | Fraction of the child that must be visible before `onVisibilityEnter` fires. Example: `0.5` = 50% visible. **Default:** `1.0`.                              |
| **minimumVisibilityMs**     | `number`          | No       | Minimum time (ms) the child must remain visible before `onVisibilityEnter` fires. If `undefined`, fires immediately.                                        |
| **debug**                   | `boolean`         | No       | When `true`, logs measurement data for debugging. Logs are disabled in production.                                                                          |

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
  const ref = useRef < LazyScrollViewMethods > null;

  return (
    // Trigger entering/exiting callbacks when child is 300 pixels outside of scrollview's bounds
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

  const onEnterThresholdPass = useCallback(async () => {
    try {
      const fetchedData = await someExpensiveApiCall();
      setData(fetchedData);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }, []);

  // Fired when LazyChild has 75% visibility for over 250 ms
  const onVisibilityEnter = useCallback(async () => {
    analyticsCall();
  }, []);

  if (!loading && !data) {
    // Trigger has fired and no data :(
    return null;
  }

  return (
    <LazyChild
      onEnterThresholdPass={onEnterThresholdPass}
      onVisibilityEnter={onVisibilityEnter}
      percentVisibleThreshold={0.75}
      minimumVisibilityMs={250}
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

  const onEnterThresholdPass = useCallback(async () => {
    setLoading(false);
  }, []);

  // Fired when LazyChild has 25% visibility
  const onVisibilityEnter = useCallback(async () => {
    analyticsCall();
    setPaused(false);
  }, []);

  // Fired when LazyChild is less that 25% visible after being visible
  const onVisibilityExit = useCallback(async () => {
    setPaused(true);
  }, []);

  return (
    <LazyChild
      onEnterThresholdPass={onEnterThresholdPass}
      onVisibilityEnter={onVisibilityEnter}
      onVisibilityExit={onVisibilityExit}
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

## Example App

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
