const Types = {
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

const SortOptions = {
  day: {
    sort: true,
    name: 'day',
  },
  event: {
    sort: false,
    name: 'event',
  },
  time: {
    sort: false,
    name: 'time',
  },
  price: {
    sort: true,
    name: 'price',
  },
  offers: {
    sort: false,
    name: 'offers',
  }
};

const UserAction = {
  UPDATE_WAYPOINT: 'UPDATE_WAYPOINT',
  ADD_WAYPOINT: 'ADD_WAYPOINT',
  DELETE_WAYPOINT: 'DELETE_WAYPOINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  ERROR: 'ERROR',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
};

export {
  Types,
  SortOptions,
  UserAction,
  UpdateType,
  FilterType,
};
