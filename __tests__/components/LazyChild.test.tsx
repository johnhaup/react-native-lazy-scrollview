import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react-native';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { LazyChild } from '../../src/components/LazyChild';
import { LazyScrollView } from '../../src/components/LazyScrollView';

describe('LazyChild', () => {
  const onThresholdPassOne = jest.fn();
  const onThresholdPassTwo = jest.fn();
  const onThresholdPassThree = jest.fn();
  const HEIGHT = 400;
  const SMALL_HEIGHT = 100;
  const CONTENT_HEIGHT = HEIGHT * 2 + SMALL_HEIGHT;

  function Child({ onThresholdPass }: { onThresholdPass: () => void }) {
    return (
      <LazyChild onThresholdPass={onThresholdPass}>
        <View>
          <Text>I am a child</Text>
        </View>
      </LazyChild>
    );
  }

  function Screen({ offset }: { offset?: number }) {
    return (
      <LazyScrollView offset={offset}>
        <Child onThresholdPass={onThresholdPassOne} />
        <Child onThresholdPass={onThresholdPassTwo} />
        <Child onThresholdPass={onThresholdPassThree} />
      </LazyScrollView>
    );
  }

  const fireOnLayouts = () => {
    fireEvent(screen.UNSAFE_queryAllByType(Animated.View)[0], 'layout', {
      nativeEvent: {
        layout: {
          height: HEIGHT,
          y: 0,
        },
      },
    });

    fireEvent(screen.UNSAFE_queryAllByType(Animated.View)[1], 'layout', {
      nativeEvent: {
        layout: {
          height: HEIGHT,
          y: HEIGHT,
        },
      },
    });

    fireEvent(screen.UNSAFE_queryAllByType(Animated.View)[2], 'layout', {
      nativeEvent: {
        layout: {
          height: SMALL_HEIGHT,
          y: HEIGHT * 2,
        },
      },
    });

    fireEvent(screen.UNSAFE_queryByType(ScrollView), 'layout', {
      nativeEvent: {
        layout: {
          height: HEIGHT,
        },
      },
    });
  };

  const fireScroll = (toValue: number) => {
    fireEvent.scroll(screen.UNSAFE_queryByType(ScrollView), {
      nativeEvent: {
        contentOffset: {
          y: toValue,
        },
        contentSize: {
          height: CONTENT_HEIGHT,
        },
      },
    });
  };

  afterEach(() => {
    onThresholdPassOne.mockClear();
    onThresholdPassTwo.mockClear();
    onThresholdPassThree.mockClear();
    cleanup();
  });

  it('calls onThresholdPass for children in view on render after layout', () => {
    const { update } = render(<Screen />);

    act(() => {
      fireOnLayouts();
    });

    update(<Screen />);

    expect(onThresholdPassOne).toHaveBeenCalledTimes(1);
    expect(onThresholdPassTwo).toHaveBeenCalledTimes(0);
    expect(onThresholdPassThree).toHaveBeenCalledTimes(0);
  });

  it('calls onThresholdPass for ChildTwo when threshold is passed', () => {
    const { update } = render(<Screen />);

    act(() => {
      fireOnLayouts();
      fireScroll(1);
    });

    update(<Screen />);

    expect(onThresholdPassOne).toHaveBeenCalledTimes(1);
    expect(onThresholdPassTwo).toHaveBeenCalledTimes(1);
    expect(onThresholdPassThree).toHaveBeenCalledTimes(0);
  });

  it('calls onThresholdPass for ChildThree when end of scrollview is reached', () => {
    const aboveThirdChild = -SMALL_HEIGHT - 10;
    const fullContentScroll = HEIGHT + SMALL_HEIGHT;
    const { update } = render(<Screen offset={aboveThirdChild} />);

    act(() => {
      fireOnLayouts();
      fireScroll(fullContentScroll - 10);
    });

    update(<Screen />);

    expect(onThresholdPassOne).toHaveBeenCalledTimes(1);
    expect(onThresholdPassTwo).toHaveBeenCalledTimes(1);
    expect(onThresholdPassThree).toHaveBeenCalledTimes(0);

    act(() => {
      fireScroll(fullContentScroll);
    });

    update(<Screen />);

    expect(onThresholdPassOne).toHaveBeenCalledTimes(1);
    expect(onThresholdPassTwo).toHaveBeenCalledTimes(1);
    expect(onThresholdPassThree).toHaveBeenCalledTimes(1);
  });
});
