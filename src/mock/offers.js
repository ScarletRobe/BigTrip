import {
  TYPES,
  OFFERS,
  OFFERS_RANGE,
} from '../consts.js';

import {
  getRandomPositiveInteger,
  getUniqueRandomPositiveInteger,
} from '../utils.js';

const getOffers = () => {
  const getUniqueOfferId = getUniqueRandomPositiveInteger(0, OFFERS.length - 1);
  const offers = [];
  for (let id = 0; id < getRandomPositiveInteger(...OFFERS_RANGE); id++) {
    offers.push({
      id,
      title: OFFERS[getUniqueOfferId()],
      price: getRandomPositiveInteger(20, 500),
    });
  }
  return offers;
};

export const getRandomOffersList = () => ({
  type: TYPES[getRandomPositiveInteger(0, TYPES.length - 1)],
  offers: getOffers(),
});

