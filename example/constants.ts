import shuffle from 'lodash/shuffle';
import { Dimensions } from 'react-native';

export const ALBUMS = [
  require('./assets/albums/american-psycho.jpg'),
  require('./assets/albums/doggstyle.jpg'),
  require('./assets/albums/dude-ranch.jpg'),
  require('./assets/albums/in_utero.jpg'),
  require('./assets/albums/is-this-it.jpg'),
  require('./assets/albums/let-it-be.jpg'),
  require('./assets/albums/rip-this.jpeg'),
  require('./assets/albums/spilt-milk.jpg'),
  require('./assets/albums/suffer.jpg'),
  require('./assets/albums/t-hives.jpg'),
  require('./assets/albums/trendkill.jpg'),
  require('./assets/albums/wysiatwin.jpg'),
  require('./assets/albums/youre-welcome.jpeg'),
  'no-lazy',
  'no-lazy',
  'fire-once',
  'fire-once',
  'ms-visibility',
  // 'ms-visibility',
];

export const SHUFFLED_ALBUMS = shuffle(ALBUMS);

export const PADDING_VERTICAL = 64;

export const SQUARE_SIZE = Math.floor(Dimensions.get('window').width * 0.5);

export const BLOCK_COLORS = [
  '#f8a5c2',
  '#f5cd79',
  '#ff7f50',
  '#7bed9f',
  '#1e90ff',
];

export const VERTICAL = {
  name: 'vertical',
  title: 'Vertical Lazy ScrollView',
  color: '#1e90ff',
  description:
    'LazyScrollView with vertical orientation.  Offset is set to -50.  For this example, this means the LazyChild will show a Skeleton until it is 50 points from the top or bottom of the scrollview container (threshold callbacks) and will have a 50% opacity until it is fully visible (visibility callbacks).',
  image: require('./assets/vertical.png'),
};

export const FLATLIST = {
  name: 'flatlist',
  title: 'Lazy FlatList',
  color: '#f8a5c2',
  description:
    'Less use cases than LazyScrollView, but still useful for situations where you need to measure headers or footers, or have specific cells react granularly to scroll visibility.  Not recommended to wrap every item in LazyChild.',
  image: require('./assets/flatlist.png'),
};

export const HORIZONTAL = {
  name: 'horizontal',
  title: 'Horizontal Lazy ScrollView',
  color: '#7bed9f',
  description:
    'LazyScrollView with horizontal orientation.  Offset is set to -50. For these examples, this means the LazyChild will show a Skeleton until it is 50 points from the left or right of the scrollview container (threshold callbacks) and will have a 50% opacity until it is fully visible (visibility callbacks).',
  image: require('./assets/horizontal.png'),
};

export const NO_LAZY = {
  name: 'nocontext',
  title: 'No LazyScrollView',
  color: '#ff7f50',
  description:
    'Standard ScrollView with no LazyScrollView wrapping the LazyChildren.  Entering callbacks fire on render and no measuring or scroll tracking occurs.',
  image: require('./assets/no.png'),
};
