import { TRIP_EVENTS_AMOUNT } from '../consts.js';

import { generateWaypoint } from '../mock/waypoint.js';
import { generateOffersByType } from '../mock/offers.js';
import { generateDestinations } from '../mock/destinations.js';

export default class WaypointsModel {
  _waypoints = Array.from({length: TRIP_EVENTS_AMOUNT}, generateWaypoint);
  _offers = generateOffersByType();
  _destinations = generateDestinations();

  get waypoints () {
    return this._waypoints;
  }

  get offers () {
    return this._offers;
  }

  get destinations () {
    return this._destinations;
  }
}
