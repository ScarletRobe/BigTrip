import ListSortView from '../view/list-sort-view.js';
import WaypointsListView from '../view/waypoints-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import NewWaypointFormView from '../view/new-waypoint-form-view.js';

import WaypointPresenter from './waypoint-presenter.js';

import { RenderPosition, render, remove } from '../framework/render.js';
import { SORT_OPTIONS, UpdateType, UserAction } from '../consts.js';

export default class TripEventsPresenter {
  #listSortComponent = null;
  #waypointsListComponent = new WaypointsListView();
  #newWaypointFormComponent = null;

  #container = null;
  #waypointsModel = null;

  #waypointPresentersList = new Map();

  #currentSortType = null;
  #waypointsSortedByDay = null;
  #waypointsSortedByPrice = null;

  /**
   * @param {object} container - DOM элемент, в который будут помещены все элементы, созданные в ходе работы.
   * @param {object} waypointsModel - Модель, содержащая всю информацию о точках маршрута.
   */
  constructor(container, waypointsModel) {
    this.#container = container;
    this.#waypointsModel = waypointsModel;

    this.#waypointsModel.addObserver(this.#modelEventHandler);
  }

  get waypoints() {
    switch (this.#currentSortType) {
      case SORT_OPTIONS.day.name:
        return this.#waypointsSortedByDay;
      case SORT_OPTIONS.price.name:
        return this.#waypointsSortedByPrice;
    }

    return this.#waypointsModel.waypoints;
  }

  #sortByDay() {
    this.#currentSortType = SORT_OPTIONS.day.name;
    if (this.#waypointsSortedByDay) {
      this.#clearBoard();
      this.#renderBoard(this.#waypointsSortedByDay);
      return;
    }

    this.#waypointsSortedByDay = this.#waypointsModel.waypoints.slice()
      .sort((a, b) => a.dateFrom.diff(b.dateFrom));
    this.#clearBoard();
    this.#renderBoard(this.#waypointsSortedByDay);
  }

  #sortByPrice() {
    this.#currentSortType = SORT_OPTIONS.price.name;
    if (this.#waypointsSortedByPrice) {
      this.#clearBoard();
      this.#renderBoard(this.#waypointsSortedByPrice);
      return;
    }

    this.#waypointsSortedByPrice = this.#waypointsModel.waypoints.slice()
      .sort((a, b) => b.basePrice - a.basePrice);
    this.#clearBoard();
    this.#renderBoard(this.#waypointsSortedByPrice);
  }

  #renderSort() {
    this.#listSortComponent = new ListSortView(this.#waypointsModel.waypoints.length, this.#currentSortType);
    render(this.#listSortComponent, this.#container, RenderPosition.AFTERBEGIN);
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
    if (!this.#waypointsModel.waypoints.length) {
      this.#renderEmptyList();
    }

    for (let i = 0; i < waypoints.length; i++) {
      const waypointPresenter = new WaypointPresenter(this.#waypointsModel, this.#waypointsListComponent.element, this.#waypointModeChangeHandler, this.#viewActionHandler);
      this.#waypointPresentersList.set(waypoints[i].id, waypointPresenter);
      waypointPresenter.init(waypoints[i]);
    }
  }

  #clearBoard() {
    this.#waypointPresentersList.forEach((presenter) => {
      presenter.destroyWaypoint();
    });
    this.#waypointPresentersList.clear();

    remove(this.#listSortComponent);
  }

  #renderBoard(waypoints) {
    this.#renderSort();
    this.#renderWaypoints(waypoints);
  }


  #viewActionHandler = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_WAYPOINT:
        this.#waypointsModel.updateWaypoint(updateType, update);
        break;
      case UserAction.ADD_WAYPOINT:
        this.#waypointsModel.addWaypoint(updateType, update);
        break;
      case UserAction.DELETE_WAYPOINT:
        this.#waypointsModel.deleteWaypoint(updateType, update);
        break;
    }
  };

  #modelEventHandler = (updateType, data) => {
    this.#waypointsSortedByDay = null;
    this.#waypointsSortedByPrice = null;
    switch (updateType) {
      case UpdateType.PATCH:
        this.#waypointPresentersList.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#currentSortType = null;
        this.#clearBoard();
        this.#renderBoard(this.#waypointsModel.waypoints);
        break;
      case UpdateType.MAJOR:
        break;
    }
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
