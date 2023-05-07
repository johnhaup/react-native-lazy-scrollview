import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react-native';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { LazyScrollView } from '../../src/components/LazyScrollView';
import { useAnimatedContext } from '../../src/context/AnimatedContext';

describe('LazyScrollView', () => {
  const SCROLLVIEW_HEIGHT = 300;

  function Child() {
    const { triggerValue } = useAnimatedContext();
    return (
      <View>
        <Text>{`Trigger Scroll:${triggerValue.value}`}</Text>
      </View>
    );
  }

  function Screen({ offset }: { offset?: number }) {
    return (
      <LazyScrollView offset={offset}>
        <Child />
      </LazyScrollView>
    );
  }

  const fireOnLayout = () => {
    fireEvent(screen.UNSAFE_queryByType(ScrollView), 'layout', {
      nativeEvent: {
        layout: {
          height: SCROLLVIEW_HEIGHT,
        },
      },
    });
  };

  afterEach(() => {
    cleanup();
  });

  it("sets scrollview's height as initial trigger value", () => {
    const { update } = render(<Screen />);

    act(() => {
      fireOnLayout();
    });

    update(<Screen />);

    expect(screen.getByText(/^Trigger Scroll:/).children).toEqual([
      `Trigger Scroll:${SCROLLVIEW_HEIGHT}`,
    ]);
  });

  it('adjusts trigger value with offset prop', () => {
    const OFFSET = -100;
    const { update } = render(<Screen offset={OFFSET} />);

    act(() => {
      fireOnLayout();
    });

    update(<Screen />);

    expect(screen.getByText(/^Trigger Scroll:/).children).toEqual([
      `Trigger Scroll:${SCROLLVIEW_HEIGHT + OFFSET}`,
    ]);
  });

  it('adjusts trigger value on scroll', () => {
    const SCROLL_VALUE = 200;
    const { update } = render(<Screen />);

    act(() => {
      fireOnLayout();

      fireEvent.scroll(screen.UNSAFE_queryByType(ScrollView), {
        nativeEvent: {
          contentOffset: {
            y: SCROLL_VALUE,
          },
          contentSize: {
            height: SCROLLVIEW_HEIGHT,
          },
        },
      });
    });

    update(<Screen />);

    expect(screen.getByText(/^Trigger Scroll:/).children).toEqual([
      `Trigger Scroll:${SCROLLVIEW_HEIGHT + SCROLL_VALUE}`,
    ]);
  });
});
