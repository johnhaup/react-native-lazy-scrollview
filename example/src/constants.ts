import shuffle from 'lodash/shuffle';
import { Dimensions } from 'react-native';

export const ALBUMS = [
  require('../assets/albums/american-psycho.jpg'),
  require('../assets/albums/doggstyle.jpg'),
  require('../assets/albums/dude-ranch.jpg'),
  require('../assets/albums/in_utero.jpg'),
  require('../assets/albums/is-this-it.jpg'),
  require('../assets/albums/let-it-be.jpg'),
  require('../assets/albums/rip-this.jpeg'),
  require('../assets/albums/spilt-milk.jpg'),
  require('../assets/albums/suffer.jpg'),
  require('../assets/albums/t-hives.jpg'),
  require('../assets/albums/trendkill.jpg'),
  require('../assets/albums/wysiatwin.jpg'),
  require('../assets/albums/youre-welcome.jpeg'),
  null,
  null,
];

export const SHUFFLED_ALBUMS = shuffle(ALBUMS);

export const PADDING_VERTICAL = 64;

export const SQUARE_SIZE = Math.floor(Dimensions.get('window').width * 0.5);
