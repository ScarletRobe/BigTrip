// Mock

const TYPES = {
  taxi: {
    id: 1,
  },
  bus: {
    id: 2,
  },
  train: {
    id: 3,
  },
  ship: {
    id: 4,
  },
  drive: {
    id: 5,
  },
  flight: {
    id: 6,
  },
  'check-in': {
    id: 7,
  },
  sightseeing: {
    id: 8,
  },
  restaurant: {
    id: 9,
  },
};

// Waypoint
const BASE_PRICE_RANGE = [300, 1500];
const DATE = '2022-08-18T15:39:12.331Z';

// Offers
const OFFERS = ['Choose meal', 'Choose seats', 'Upgrade to comfort class', 'Upgrade to business class', 'Add luggage', 'Business lounge'];
const OFFER_PRICE_RANGE = [20, 500];
const OFFERS_AMOUNT = 4;

// Destinations
const CITIES = ['Chamonix', 'Geneva', 'Oslo', 'Helsinki', 'Amsterdam'];
const CITIES_DESCRIPTIONS = [', middle-eastern paradise, a perfect place to stay with a family.', ', with an embankment of a mighty river as a centre of attraction.', ', a true asian pearl.', ', with a beautiful old town.'];
const PICTURES_DESCRIPTIONS = ['street market', 'city centre', 'kindergarten', 'parliament building', 'zoo', 'central station'];
const PICTURES_RANGE = [1, 10];

const TRIP_EVENTS_AMOUNT = 10;

//

const SORT_OPTIONS = {
  day: {
    sort: true,
  },
  event: {
    sort: false,
  },
  time: {
    sort: false,
  },
  price: {
    sort: true,
  },
  offers: {
    sort: false,
  }
};

export {
  TYPES,
  OFFERS,
  CITIES,
  CITIES_DESCRIPTIONS,
  PICTURES_DESCRIPTIONS,
  PICTURES_RANGE,
  TRIP_EVENTS_AMOUNT,
  OFFER_PRICE_RANGE,
  BASE_PRICE_RANGE,
  DATE,
  OFFERS_AMOUNT,
  SORT_OPTIONS,
};
