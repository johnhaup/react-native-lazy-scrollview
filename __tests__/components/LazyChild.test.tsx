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
  const CHILD_HEIGHT = 400;
  const SCROLLVIEW_HEIGHT = 300;

  function ChildOne() {
    return (
      <LazyChild onThresholdPass={onThresholdPassOne}>
        <View>
          <Text>I am a child</Text>
        </View>
      </LazyChild>
    );
  }

  function ChildTwo() {
    return (
      <LazyChild onThresholdPass={onThresholdPassTwo}>
        <View>
          <Text>I am a child</Text>
        </View>
      </LazyChild>
    );
  }

  function Screen({ offset }: { offset?: number }) {
    return (
      <LazyScrollView offset={offset}>
        <ChildOne />
        <ChildTwo />
      </LazyScrollView>
    );
  }

  const fireOnLayouts = () => {
    fireEvent(screen.UNSAFE_queryAllByType(Animated.View)[0], 'layout', {
      nativeEvent: {
        layout: {
          height: CHILD_HEIGHT,
          y: 0,
        },
      },
    });
    fireEvent(screen.UNSAFE_queryAllByType(Animated.View)[1], 'layout', {
      nativeEvent: {
        layout: {
          height: CHILD_HEIGHT,
          y: CHILD_HEIGHT + 1,
        },
      },
    });

    fireEvent(screen.UNSAFE_queryByType(ScrollView), 'layout', {
      nativeEvent: {
        layout: {
          height: SCROLLVIEW_HEIGHT,
        },
      },
    });
  };

  afterEach(() => {
    onThresholdPassOne.mockClear();
    onThresholdPassTwo.mockClear();
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
  });

  it('calls onThresholdPass for ChildTwo when threshold is passed', () => {
    const { update } = render(<Screen />);

    act(() => {
      fireOnLayouts();

      fireEvent.scroll(screen.UNSAFE_queryByType(ScrollView), {
        nativeEvent: {
          contentOffset: {
            y: CHILD_HEIGHT - SCROLLVIEW_HEIGHT + 2,
          },
        },
      });
    });

    update(<Screen />);

    expect(onThresholdPassOne).toHaveBeenCalledTimes(1);
    expect(onThresholdPassTwo).toHaveBeenCalledTimes(1);
  });
});
