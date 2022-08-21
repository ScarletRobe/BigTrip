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

  init = (container, waypointsModel) => {
    this.container = container;
    this.waypointsModel = waypointsModel;

    render(this.listSortComponent, this.container);
    render(this.waypointsListComponent, this.container);
    render(new EditWaypointFormView(), this.waypointsListComponent.getElement(), RenderPosition.AFTERBEGIN);
    render(new NewWaypointFormView(), this.waypointsListComponent.getElement());

    for (let i = 0; i < TRIP_EVENTS_AMOUNT; i++) {
      const destination = this.waypointsModel.destinations.find((dest) => dest.id === this.waypointsModel.waypoints[i].destination);

      const offersList = this.waypointsModel.offers.find((offer) => offer.type === this.waypointsModel.waypoints[i].type);
      const offers = [];
      this.waypointsModel.waypoints[i].offers.forEach((offerId) => {
        offers.push(offersList.offers.find((offer) => offer.id === offerId));
      });

      render(new WaypointItemView(this.waypointsModel.waypoints[i], destination, offers), this.waypointsListComponent.getElement());
    }
  };
}
