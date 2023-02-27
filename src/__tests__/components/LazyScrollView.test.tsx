import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react-native';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { LazyChild } from '../../components/LazyChild';
import { LazyScrollView } from '../../components/LazyScrollView';

describe('LazyScrollView', () => {
  const SCROLLVIEW_HEIGHT = 300;
  function TestChild() {
    return (
      <LazyChild onThresholdPass={jest.fn()}>
        <View />
      </LazyChild>
    );
  }

  function Screen({ offset }: { offset?: number }) {
    return (
      <LazyScrollView offset={offset}>
        <LazyChild onThresholdPass={jest.fn()}>
          <View />
        </LazyChild>
        <TestChild />
        <View testID={'empty-view-child'} />
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

    expect(screen.UNSAFE_queryByType(LazyChild).props.triggerValue).toEqual({
      value: SCROLLVIEW_HEIGHT,
    });
  });

  it('passes triggerValue to all LazyChild components', () => {
    const { update } = render(<Screen />);

    act(() => {
      fireOnLayout();
    });

    update(<Screen />);

    const lazyChildren = screen.UNSAFE_queryAllByType(LazyChild);

    expect(lazyChildren.length).toBe(2);
    expect(lazyChildren[0].props.triggerValue).toEqual({
      value: SCROLLVIEW_HEIGHT,
    });
    expect(lazyChildren[1].props).toBe('af');
  });

  it('does not pass triggerValue to children that are not LazyChild components', () => {
    const { update } = render(<Screen />);

    act(() => {
      fireOnLayout();
    });

    update(<Screen />);

    expect(
      screen.UNSAFE_queryByType(TestChild).props.triggerValue
    ).toBeUndefined();
    expect(
      screen.getByTestId('empty-view-child').props.triggerValue
    ).toBeUndefined();
  });

  // it('adjusts trigger value with offset prop', () => {
  //   const OFFSET = -100;
  //   const { update } = render(<Screen offset={OFFSET} />);

  //   act(() => {
  //     fireOnLayout();
  //   });

  //   update(<Screen />);

  //   expect(screen.getByText(/^Trigger Scroll:/).children).toEqual([
  //     `Trigger Scroll:${SCROLLVIEW_HEIGHT + OFFSET}`,
  //   ]);
  // });

  // it('adjusts trigger value on scroll', () => {
  //   const SCROLL_VALUE = 200;
  //   const { update } = render(<Screen />);

  //   act(() => {
  //     fireOnLayout();

  //     fireEvent.scroll(screen.UNSAFE_queryByType(ScrollView), {
  //       nativeEvent: {
  //         contentOffset: {
  //           y: SCROLL_VALUE,
  //         },
  //       },
  //     });
  //   });

  //   update(<Screen />);

  //   expect(screen.getByText(/^Trigger Scroll:/).children).toEqual([
  //     `Trigger Scroll:${SCROLLVIEW_HEIGHT + SCROLL_VALUE}`,
  //   ]);
  // });
});
