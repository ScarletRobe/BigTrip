import {
  TYPES,
  CITIES,
  BASE_PRICE_RANGE,
  DATE,
  OFFERS_AMOUNT,
} from '../consts.js';

import {
  getRandomPositiveInteger,
  getUniqueRandomPositiveInteger,
} from '../utils.js';

import dayjs from 'dayjs';

/**
 * Генерирует случайные даты прибытия и отправления.
 * @returns объект с датами.
 */
const generateDate = () => {
  const dateFrom = dayjs(DATE).add(getRandomPositiveInteger(0, 5), 'd').add(getRandomPositiveInteger(0, 5), 'h').add(getRandomPositiveInteger(0, 59), 'm');
  const dateTo = dayjs(dateFrom).add(getRandomPositiveInteger(0, 1), 'd').add(getRandomPositiveInteger(0, 5), 'h').add(getRandomPositiveInteger(0, 59), 'm');
  return {dateFrom, dateTo};
};

/**
 * Генерирует случайный набор выбранных дополнительных предложений для точки маршрута.
 * @returns {array} массив id предложений.
 */
const getRandomOffersSet = () => Array.from({length: getRandomPositiveInteger(0, OFFERS_AMOUNT)}, getUniqueRandomPositiveInteger(1, OFFERS_AMOUNT));

/**
 * Генерирует случайную точку маршрута
 * @param {number} id - id точки маршрута
 * @returns {object} объект с информацией о точке маршрута.
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
