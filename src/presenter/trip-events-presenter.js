import ListSortView from '../view/list-sort-view.js';
import WaypointsListView from '../view/waypoints-list-view.js';
import EmptyListView from '../view/empty-list-view.js';

import WaypointPresenter from './waypoint-presenter.js';

import { render } from '../framework/render.js';
import { TRIP_EVENTS_AMOUNT } from '../consts.js';

export default class TripEventsPresenter {
  #listSortComponent = null;
  #waypointsListComponent = new WaypointsListView();

  #container = null;
  #waypointsModel = null;

  #waypointPresentersList = new Map();

  /**
   * @param {object} container - DOM элемент, в который будут помещены все элементы, созданные в ходе работы.
   * @param {object} waypointsModel - Модель, содержащая всю информацию о местах назначения.
   */
  constructor(container, waypointsModel) {
    this.#container = container;
    this.#waypointsModel = waypointsModel;
    this.#listSortComponent = new ListSortView(this.#waypointsModel.waypoints.length);
  }

  #renderSort() {
    render(this.#listSortComponent, this.#container);
  }

  #renderWaypointsList() {
    render(this.#waypointsListComponent, this.#container);
  }

  #renderEmptyList() {
    render(new EmptyListView(), this.#container);
  }

  /**
   * Создает презентер под отдельную точку маршрута.
   * @param {object} waypoint - объект с информацией о месте назначения.
   */
  #renderWaypoint(waypoint) {
    const waypointPresenter = new WaypointPresenter(this.#waypointsModel, this.#waypointsListComponent.element, this.#waypointModeChangeHandler);
    this.#waypointPresentersList.set(waypoint.id, waypointPresenter);
    waypointPresenter.init(waypoint);
  }

  /**
   * Отрисовывает базовые элементы.
   */
  init = () => {
    this.#renderSort();
    this.#renderWaypointsList();

    if (!this.#waypointsModel.waypoints.length) {
      this.#renderEmptyList();
    }
    for (let i = 0; i < TRIP_EVENTS_AMOUNT; i++) {
      this.#renderWaypoint(this.#waypointsModel.waypoints[i]);
    }
  };

  #waypointModeChangeHandler = () => {
    this.#waypointPresentersList.forEach((presenter) => {
      presenter.resetView();
    });
  };
}
