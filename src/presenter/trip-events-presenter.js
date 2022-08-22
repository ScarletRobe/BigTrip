import ListSortView from '../view/list-sort-view.js';
import WaypointsListView from '../view/waypoints-list-view.js';
import NewWaypointFormView from '../view/new-waypoint-form-view.js';
import WaypointItemView from '../view/waypoint-item-view.js';
import EditWaypointFormView from '../view/edit-waypoint-form-view.js';

import { RenderPosition, render } from '../render.js';
import { TRIP_EVENTS_AMOUNT } from '../consts.js';

export default class TripEventsPresenter {
  listSortComponent = new ListSortView();
  waypointsListComponent = new WaypointsListView();

  getSelectedDestination(waypoint) {
    return this.waypointsModel.destinations.find((dest) => dest.id === waypoint.destination);
  }

  getSelectedOffers(waypoint) {
    const offersList = this.waypointsModel.offers.find((offer) => offer.type === waypoint.type);
    const offers = [];
    waypoint.offers.forEach((offerId) => {
      offers.push(offersList.offers.find((offer) => offer.id === offerId));
    });
    return offers;
  }

  init = (container, waypointsModel) => {
    this.container = container;
    this.waypointsModel = waypointsModel;

    render(this.listSortComponent, this.container);
    render(this.waypointsListComponent, this.container);

    render(new EditWaypointFormView(this.waypointsModel.waypoints[0], this.getSelectedDestination(this.waypointsModel.waypoints[0]), this.getSelectedOffers(this.waypointsModel.waypoints[0]), this.waypointsModel.destinations, this.waypointsModel.offers), this.waypointsListComponent.getElement(), RenderPosition.AFTERBEGIN);
    render(new NewWaypointFormView(), this.waypointsListComponent.getElement());

    for (let i = 1; i < TRIP_EVENTS_AMOUNT; i++) {
      render(new WaypointItemView(this.waypointsModel.waypoints[i], this.getSelectedDestination(this.waypointsModel.waypoints[i]), this.getSelectedOffers(this.waypointsModel.waypoints[i])), this.waypointsListComponent.getElement());
    }
  };
}
