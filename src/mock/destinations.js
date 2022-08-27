import {
  getRandomPositiveInteger,
} from '../utils.js';

import {
  CITIES,
  CITIES_DESCRIPTIONS,
  PICTURES_DESCRIPTIONS,
  PICTURES_RANGE,
} from '../consts.js';

/**
 * Генерирует раздел со случайными фотографиями и их описаниями для города.
 * @param {string} city - место назначения.
 * @returns {array} массив фотографий и описаний.
 */
const generatePictures = (city) => Array.from({length: getRandomPositiveInteger(...PICTURES_RANGE)}, () => ({
  src: 'http://picsum.photos/300/200?r=1',
  description: `${city} ${PICTURES_DESCRIPTIONS[getRandomPositiveInteger(0, PICTURES_DESCRIPTIONS.length - 1)]}`,
}));

/**
 * Генерирует случайные места назначения.
 * @returns {array} массив мест назначения.
 */
export const generateDestinations = () => Array.from({length: CITIES.length}, (_value, index) => ({
  id: index + 1,
  name: CITIES[index],
  description: `${CITIES[index]}${CITIES_DESCRIPTIONS[getRandomPositiveInteger(0, CITIES_DESCRIPTIONS.length - 1)]}`,
  pictures: generatePictures(CITIES[index])
}));

