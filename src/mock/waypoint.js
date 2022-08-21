import {
  TYPES,
  OFFERS,
  CITIES,
  BASE_PRICE_RANGE,
} from '../consts.js';

import {
  getRandomPositiveInteger,
  getUniqueRandomPositiveInteger,
} from '../utils.js';

/**
 * Генерирует случайный набор offers для точки маршрута
 * @returns массив выбранных offers
 */
const getRandomOffersSet = () => {
  const result = [];
  const getRandomOffer = getUniqueRandomPositiveInteger(1, OFFERS.length);
  for (let i = 0; i < getRandomPositiveInteger(0, OFFERS.length); i++) {
    result.push(getRandomOffer());
  }
  return result;
};

// TODO: Randomize date with dayjs
/**
 * Генерирует случайную точку маршрута
 * @param {number} id - id точки маршрута
 * @returns случайно сгенерированная точка маршрута
 */
export const generateWaypoint = (id = 0) => ({
  id,
  type: TYPES[getRandomPositiveInteger(0,TYPES.length - 1)],
  dateFrom: '2022-08-18T15:39:12.331Z',
  dateTo: '2022-08-18T20:13:59.437Z',
  destination: getRandomPositiveInteger(1, CITIES.length),
  basePrice: getRandomPositiveInteger(...BASE_PRICE_RANGE),
  isFavorite: Boolean(getRandomPositiveInteger(0, 1)),
  offers: getRandomOffersSet(),
});
