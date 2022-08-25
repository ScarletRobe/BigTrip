import {
  TYPES,
  OFFERS,
  OFFER_PRICE_RANGE,
  OFFERS_AMOUNT,
} from '../consts.js';

import {
  getRandomPositiveInteger,
  getUniqueRandomPositiveInteger,
} from '../utils.js';

/**
 * Генерирует все возможные дополнительные предложения.
 * @returns {array} массив предложений.
 */
const getOffers = () => {
  const getUniqueOfferId = getUniqueRandomPositiveInteger(1, OFFERS.length - 1);
  return Array.from({length: OFFERS_AMOUNT}, (_value, index) => ({
    id: ++index,
    title: OFFERS[getUniqueOfferId()],
    price: getRandomPositiveInteger(...OFFER_PRICE_RANGE),
  }));
};

/**
 * Генерирует все варианты событий и дополнительных предложений к ним.
 * @returns {array} массив типов событий и опций.
 */
export const generateOffersByType = () => Array.from({length: TYPES.length}, (_value, index) => ({
  type: TYPES[index],
  offers: getOffers(),
}));

