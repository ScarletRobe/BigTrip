import {
  TYPES,
  OFFERS,
  OFFER_PRICE_RANGE
} from '../consts.js';

import {
  getRandomPositiveInteger,
} from '../utils.js';

/**
 * Генерирует все возможные дополнительные предложения.
 * @returns {array} массив предложений.
 */
const getOffers = () => {
  const offers = [];
  for (let id = 1; id <= OFFERS.length; id++) {
    offers.push({
      id,
      title: OFFERS[id - 1],
      price: getRandomPositiveInteger(...OFFER_PRICE_RANGE),
    });
  }
  return offers;
};

/**
 * Генерирует все варианты событий и дополнительных предложений к ним.
 * @returns {array} массив типов событий и опций.
 */
export const generateOffersByType = () => {
  const result = [];
  for (let i = 0; i < TYPES.length; i++) {
    result.push({
      type: TYPES[i],
      offers: getOffers(),
    });
  }
  return result;
};

