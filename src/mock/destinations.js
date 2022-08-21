import {
  getRandomPositiveInteger,
} from '../utils.js';

import {
  CITIES,
  CITIES_DESCRIPTIONS,
  PICTURES_DESCRIPTIONS,
  PICTURES_RANGE,
} from '../consts.js';

const generatePictures = (city) => {
  const result = [];
  for (let i = 0; i < getRandomPositiveInteger(...PICTURES_RANGE); i++) {
    result.push({
      src: 'http://picsum.photos/300/200?r=1',
      description: `${city} ${PICTURES_DESCRIPTIONS[getRandomPositiveInteger(0, PICTURES_DESCRIPTIONS.length - 1)]}`,
    });
  }
  return result;
};

export const generateDestinations = () => {
  const result = [];
  for (let id = 1; id <= CITIES.length; id++) {
    result.push({
      id,
      name: CITIES[id - 1],
      description: `${CITIES[id - 1]}${CITIES_DESCRIPTIONS[getRandomPositiveInteger(0, CITIES_DESCRIPTIONS.length - 1)]}`,
      pictures: generatePictures(CITIES[id - 1]),
    });
  }
  return result;
};
