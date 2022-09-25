import ListSortView from '../view/list-sort-view.js';
import WaypointsListView from '../view/waypoints-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import NewWaypointFormView from '../view/new-waypoint-form-view.js';

import WaypointPresenter from './waypoint-presenter.js';

import { RenderPosition, render, remove } from '../framework/render.js';
import { SORT_OPTIONS, UpdateType, UserAction, FilterType } from '../consts.js';

export default class TripEventsPresenter {
  #listSortComponent = null;
  #waypointsListComponent = new WaypointsListView();
  #newWaypointFormComponent = null;
  #emptyListComponent = null;

  #container = null;
  #waypointsModel = null;
  #filterModel = null;

  #waypointPresentersList = new Map();

  #currentSortType = null;
  #currentFilter = FilterType.Everything;

  #waypointsSortedByDay = null;
  #waypointsSortedByPrice = null;
  #futureWaypoints = null;

  /**
   * @param {object} container - DOM элемент, в который будут помещены все элементы, созданные в ходе работы.
   * @param {object} waypointsModel - Модель, содержащая всю информацию о точках маршрута.
   */
  constructor(container, waypointsModel, filterModel) {
    this.#container = container;
    this.#waypointsModel = waypointsModel;
    this.#filterModel = filterModel;

    this.#waypointsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#filterModelEventHandler);
  }

  get waypoints() {
    switch (this.#currentFilter) {
      case FilterType.Future:
        return this.#futureWaypoints;
    }

    switch (this.#currentSortType) {
      case SORT_OPTIONS.day.name:
        return this.#waypointsSortedByDay;
      case SORT_OPTIONS.price.name:
        return this.#waypointsSortedByPrice;
    }


    return this.#waypointsModel.waypoints;
  }

  #sortByDay() {
    if (this.#waypointsSortedByDay) {
      this.#currentSortType = SORT_OPTIONS.day.name;
      this.#clearBoard();
      this.#renderBoard(this.#waypointsSortedByDay);
      return;
    }

    this.#waypointsSortedByDay = this.waypoints.slice()
      .sort((a, b) => a.dateFrom.diff(b.dateFrom));
    this.#currentSortType = SORT_OPTIONS.day.name;
    this.#clearBoard();
    this.#renderBoard(this.#waypointsSortedByDay);
  }

  #sortByPrice() {
    if (this.#waypointsSortedByPrice) {
      this.#currentSortType = SORT_OPTIONS.price.name;
      this.#clearBoard();
      this.#renderBoard(this.#waypointsSortedByPrice);
      return;
    }

    this.#waypointsSortedByPrice = this.waypoints.slice()
      .sort((a, b) => b.basePrice - a.basePrice);
    this.#currentSortType = SORT_OPTIONS.price.name;
    this.#clearBoard();
    this.#renderBoard(this.#waypointsSortedByPrice);
  }

  #filterFutureEvents() {
    this.#currentFilter = FilterType.Future;
    if (this.#futureWaypoints) {
      this.#clearBoard();
      this.#renderBoard(this.#futureWaypoints);
      return;
    }

    this.#futureWaypoints = this.#waypointsModel.waypoints.slice()
      .filter((a) => a.dateFrom.toDate() >= new Date());
    this.#clearBoard();
    this.#renderBoard(this.#futureWaypoints);
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
    this.#emptyListComponent = new EmptyListView(this.#currentFilter);
    render(this.#emptyListComponent, this.#container);
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
    if (!this.waypoints.length) {
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

    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }

    remove(this.#listSortComponent);
  }

  #renderBoard(waypoints) {
    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }
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
        this.#filterModel.setFilter(UpdateType.MINOR, FilterType.Everything);
        // this.#clearBoard();
        // this.#renderBoard(this.waypoints);
        break;
    }
  };

  #filterModelEventHandler = (_, currentFilter) => {
    this.#waypointsSortedByDay = null;
    this.#waypointsSortedByPrice = null;
    this.#currentSortType = null;
    this.#futureWaypoints = null;

    switch (currentFilter) {
      case FilterType.Future:
        this.#filterFutureEvents();
        break;
      case FilterType.Everything:
        this.#currentFilter = FilterType.Everything;
        this.#clearBoard();
        this.#renderBoard(this.#waypointsModel.waypoints);
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
