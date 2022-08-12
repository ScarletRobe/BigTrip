import ListSortView from '../view/list-sort-view.js';
import WaypointsListView from '../view/waypoints-list-view.js';
import NewWaypointFormView from '../view/new-waypoint-form-view.js';
import WaypointItemView from '../view/waypoint-item-view.js';
import EditWaypointFormView from '../view/edit-waypoint-form-view.js';

import { RenderPosition, render } from '../render.js';

export default class TripEventsPresenter {
  listSortComponent = new ListSortView();
  waypointListComponent = new WaypointsListView();

  init = (container) => {
    this.container = container;

    render(this.listSortComponent, this.container);
    render(this.waypointListComponent, this.container);
    render(new EditWaypointFormView(), this.waypointListComponent.getElement(), RenderPosition.AFTERBEGIN);
    render(new NewWaypointFormView, this.waypointListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new WaypointItemView, this.waypointListComponent.getElement());
    }
  };
}
