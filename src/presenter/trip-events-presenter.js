import ListSortView from '../view/list-sort-view.js';
import WaypointsListView from '../view/waypoints-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import NewWaypointFormView from '../view/new-waypoint-form-view.js';

import WaypointPresenter from './waypoint-presenter.js';

import { RenderPosition, render } from '../framework/render.js';
import { TRIP_EVENTS_AMOUNT } from '../consts.js';
import { changeArrayItem } from '../utils.js';

export default class TripEventsPresenter {
  #listSortComponent = null;
  #waypointsListComponent = new WaypointsListView();
  #newWaypointFormComponent = null;

  #container = null;
  #waypointsModel = null;

  #waypointPresentersList = new Map();

  #waypointsSortedByDay = null;
  #waypointsSortedByPrice = null;

  /**
   * @param {object} container - DOM элемент, в который будут помещены все элементы, созданные в ходе работы.
   * @param {object} waypointsModel - Модель, содержащая всю информацию о точках маршрута.
   */
  constructor(container, waypointsModel) {
    this.#container = container;
    this.#waypointsModel = waypointsModel;
    this.#listSortComponent = new ListSortView(this.#waypointsModel.waypoints.length);
  }

  #sortByDay() {
    if (this.#waypointsSortedByDay) {
      this.#clearWaypointsList();
      this.#renderWaypoints(this.#waypointsSortedByDay);
      return;
    }

    this.#waypointsSortedByDay = this.#waypointsModel.waypoints.slice()
      .sort((a, b) => a.dateFrom.diff(b.dateFrom));
    this.#clearWaypointsList();
    this.#renderWaypoints(this.#waypointsSortedByDay);
  }

  #sortByPrice() {
    if (this.#waypointsSortedByPrice) {
      this.#clearWaypointsList();
      this.#renderWaypoints(this.#waypointsSortedByPrice);
      return;
    }

    this.#waypointsSortedByPrice = this.#waypointsModel.waypoints.slice()
      .sort((a, b) => b.basePrice - a.basePrice);
    this.#clearWaypointsList();
    this.#renderWaypoints(this.#waypointsSortedByPrice);
  }

  #renderSort() {
    render(this.#listSortComponent, this.#container);
    this.#listSortComponent.setListener('click', this.#listSortClickHandler);
  }

  #renderWaypointsList() {
    render(this.#waypointsListComponent, this.#container);
  }

  #renderEmptyList() {
    render(new EmptyListView(), this.#container);
  }

  #renderNewWaypointForm() {
    this.#newWaypointFormComponent = new NewWaypointFormView(this.#waypointsModel.offers, this.#waypointsModel.destinations);
    render(this.#newWaypointFormComponent, this.#waypointsListComponent.element, RenderPosition.AFTERBEGIN);
    // this.#newWaypointFormComponent.setListener('cancel', () => {})
  }

  /**
   * Создает презентер под отдельную точку маршрута.
   * @param {object} waypoint - объект с информацией о точке маршрута.
   */
  #renderWaypoints(waypoints) {
    for (let i = 0; i < TRIP_EVENTS_AMOUNT; i++) {
      const waypointPresenter = new WaypointPresenter(this.#waypointsModel, this.#waypointsListComponent.element, this.#waypointModeChangeHandler, this.#waypointUpdateHandler);
      this.#waypointPresentersList.set(waypoints[i].id, waypointPresenter);
      waypointPresenter.init(waypoints[i]);
    }
  }

  #clearWaypointsList() {
    this.#waypointPresentersList.forEach((presenter) => {
      presenter.destroyWaypoint();
    });
    this.#waypointPresentersList.clear();
  }

  /**
   * Реагирует на обновление точки маршрута и заменяет старую на новую.
   * @param {object} updatedWaypoint - обновленная точка маршрута.
   */
  #waypointUpdateHandler = (updatedWaypoint) => {
    this.#waypointsModel.waypoints = changeArrayItem(this.#waypointsModel.waypoints, updatedWaypoint);
    this.#waypointPresentersList.get(updatedWaypoint.id).init(updatedWaypoint);
    this.#waypointsSortedByDay = null;
    this.#waypointsSortedByPrice = null;
  };

  #waypointModeChangeHandler = () => {
    this.#waypointPresentersList.forEach((presenter) => {
      presenter.resetView();
    });
  };

  /**
   * Отрисовывает базовые элементы.
   */
  init() {
    this.#renderSort();
    this.#renderWaypointsList();

    if (!this.#waypointsModel.waypoints.length) {
      this.#renderEmptyList();
    }
    this.#renderWaypoints(this.#waypointsModel.waypoints);
  }

  createNewWaypointFormComponentView() {
    if (this.#newWaypointFormComponent) {
      return;
    }
    this.#renderNewWaypointForm();
  }

  // Обработчики

  #listSortClickHandler = (type) => {
    switch(type) {
      case 'day':
        this.#sortByDay();
        break;
      case 'price':
        this.#sortByPrice();
        break;
    }
  };
}
