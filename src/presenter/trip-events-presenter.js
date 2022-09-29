import ListSortView from '../view/list-sort-view.js';
import WaypointsListView from '../view/waypoints-list-view.js';
import EmptyListView from '../view/empty-list-view.js';

import WaypointPresenter from './waypoint-presenter.js';
import NewWaypointPresenter from './new-waypoint-presenter.js';

import { RenderPosition, render, remove } from '../framework/render.js';
import { SORT_OPTIONS, UpdateType, UserAction, FilterType } from '../consts.js';

export default class TripEventsPresenter {
  #listSortComponent = null;
  #waypointsListComponent = new WaypointsListView();
  #emptyListComponent = null;

  #container = null;
  #waypointsModel = null;
  #filterModel = null;

  #waypointPresentersList = new Map();
  #newWaypointPresenter = null;

  #currentSortType = null;
  #currentFilter = FilterType.Everything;

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
    let result = this.#waypointsModel.waypoints;

    switch (this.#currentFilter) {
      case FilterType.Future:
        result = this.#filterFutureEvents(result);
        break;
    }

    switch (this.#currentSortType) {
      case SORT_OPTIONS.day.name:
        result = this.#sortByDay(result);
        break;
      case SORT_OPTIONS.price.name:
        result = this.#sortByPrice(result);
        break;
    }


    return result;
  }

  #sortByDay(waypoints) {
    return waypoints.slice()
      .sort((a, b) => a.dateFrom.diff(b.dateFrom));
  }

  #sortByPrice(waypoints) {
    return waypoints.slice()
      .sort((a, b) => b.basePrice - a.basePrice);
  }

  #filterFutureEvents(waypoints) {
    return waypoints.slice()
      .filter((a) => a.dateFrom.toDate() >= new Date());
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

  /**
   * Создает презентер под отдельную точку маршрута.
   * @param {object} waypoint - объект с информацией о точке маршрута.
   */
  #renderWaypoints(waypoints) {
    if (!waypoints.length) {
      this.#renderEmptyList();
    }

    for (let i = 0; i < waypoints.length; i++) {
      const waypointPresenter = new WaypointPresenter(this.#waypointsModel, this.#waypointsListComponent.element, this.#waypointModeChangeHandler, this.#viewActionHandler);
      this.#waypointPresentersList.set(waypoints[i].id, waypointPresenter);
      waypointPresenter.init(waypoints[i]);
    }
  }

  #clearBoard() {
    if (this.#newWaypointPresenter) {
      this.#newWaypointPresenter.destroy();
    }

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

  createNewWaypointFormComponentView(cancelCallback) {
    this.#waypointPresentersList.forEach((presenter) => {
      presenter.resetView();
    });

    this.#filterModel.setFilter(UpdateType.MINOR, FilterType.Everything);

    this.#newWaypointPresenter = new NewWaypointPresenter(this.#waypointsListComponent.element, this.#viewActionHandler, this.#waypointsModel.offers, this.#waypointsModel.destinations);
    this.#newWaypointPresenter.init(cancelCallback);

  }

  // Обработчики

  #listSortClickHandler = (type) => {
    switch(type) {
      case 'day':
        this.#currentSortType = SORT_OPTIONS.day.name;
        break;
      case 'price':
        this.#currentSortType = SORT_OPTIONS.price.name;
        break;
    }
    this.#clearBoard();
    this.#renderBoard(this.waypoints);
  };

  #waypointModeChangeHandler = () => {
    this.#waypointPresentersList.forEach((presenter) => {
      presenter.resetView();
    });

    if (this.#newWaypointPresenter) {
      this.#newWaypointPresenter.destroy();
    }
  };

  #filterModelEventHandler = (_, currentFilter) => {
    this.#currentSortType = this.#currentSortType ? SORT_OPTIONS.day.name : null;

    switch (currentFilter) {
      case FilterType.Future:
        this.#currentFilter = FilterType.Future;
        break;
      case FilterType.Everything:
        this.#currentFilter = FilterType.Everything;
        break;
    }
    this.#clearBoard();
    this.#renderBoard(this.waypoints);
  };

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#waypointPresentersList.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#currentSortType = null;
        this.#filterModel.setFilter(UpdateType.MINOR, FilterType.Everything);
        break;
    }
  };

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
}
