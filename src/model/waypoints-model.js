import { TRIP_EVENTS_AMOUNT } from '../consts.js';

import { generateWaypoint } from '../mock/waypoint.js';
import { generateOffersByType } from '../mock/offers.js';
import { generateDestinations } from '../mock/destinations.js';

export default class WaypointsModel {
  #waypoints = Array.from({length: TRIP_EVENTS_AMOUNT}, (_value, index) => generateWaypoint(index));
  #offers = generateOffersByType();
  #destinations = generateDestinations();

  get waypoints () {
    return this.#waypoints;
  }

  set waypoints (waypoints) {
    this.#waypoints = waypoints;
  }

  get offers () {
    return this.#offers;
  }

  get destinations () {
    return this.#destinations;
  }
}
