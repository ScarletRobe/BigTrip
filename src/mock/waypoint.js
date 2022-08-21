import { TYPE } from './consts.js';
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
  const getRandomOffer = getUniqueRandomPositiveInteger(1, 5);
  for (let i = 0; i < getRandomPositiveInteger(1,5); i++) {
    result.push(getRandomOffer());
  }
  return result;
};

/**
 * Генерирует случайную точку маршрута
 * @param {number} id - id точки маршрута
 * @returns случайно сгенерированная точка маршрута
 */
export const generateWaypoint = (id = 0) => ({
  id,
  type: TYPE[getRandomPositiveInteger(0,TYPE.length - 1)],
  dateFrom: '2022-08-18T15:39:12.331Z',
  dateTo: '2022-08-18T20:13:59.437Z',
  destination: getRandomPositiveInteger(1, 20),
  basePrice: getRandomPositiveInteger(300, 1500),
  isFavorite: Boolean(getRandomPositiveInteger(0, 1)),
  offers: getRandomOffersSet(),
});
