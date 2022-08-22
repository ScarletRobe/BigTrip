import {
  TYPES,
  OFFERS,
  CITIES,
  BASE_PRICE_RANGE,
  DATE,
} from '../consts.js';

import {
  getRandomPositiveInteger,
  getUniqueRandomPositiveInteger,
} from '../utils.js';

import dayjs from 'dayjs';

const generateDate = () => {
  const dateFrom = dayjs(DATE).add(getRandomPositiveInteger(0, 5), 'd').add(getRandomPositiveInteger(0, 5), 'h').add(getRandomPositiveInteger(0, 59), 'm');
  const dateTo = dayjs(dateFrom).add(getRandomPositiveInteger(0, 1), 'd').add(getRandomPositiveInteger(0, 5), 'h').add(getRandomPositiveInteger(0, 59), 'm');
  return {dateFrom, dateTo};
};

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

/**
 * Генерирует случайную точку маршрута
 * @param {number} id - id точки маршрута
 * @returns случайно сгенерированная точка маршрута
 */
export const generateWaypoint = (id = 0) => {
  const date = generateDate();
  return {
    id,
    type: TYPES[getRandomPositiveInteger(0,TYPES.length - 1)],
    dateFrom: date.dateFrom,
    dateTo: date.dateTo,
    destination: getRandomPositiveInteger(1, CITIES.length),
    basePrice: getRandomPositiveInteger(...BASE_PRICE_RANGE),
    isFavorite: Boolean(getRandomPositiveInteger(0, 1)),
    offers: getRandomOffersSet(),
  };
};
