import ListSortView from '../view/list-sort-view.js';
import WaypointsListView from '../view/waypoints-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import LoadingView from '../view/loading-view.js';
import ErrorMessageView from '../view/error-message-view';

import WaypointPresenter from './waypoint-presenter.js';
import NewWaypointPresenter from './new-waypoint-presenter.js';

import { RenderPosition, render, remove } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { SortOptions, UpdateType, UserAction, FilterType } from '../consts.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class TripEventsPresenter {
  #listSortComponent = null;
  #waypointsListComponent = new WaypointsListView();
  #emptyListComponent = null;
  #loadingComponent = new LoadingView();
  #errorMessageComponent = null;

  #container = null;
  #waypointsModel = null;
  #filterModel = null;

  #waypointPresentersList = new Map();
  #newWaypointPresenter = null;
  #filterPresenter = null;

  #currentSortType = SortOptions.day.name;
  #currentFilter = FilterType.EVERYTHING;
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  /**
   * @param {object} container - DOM элемент, в который будут помещены все элементы, созданные в ходе работы.
   * @param {object} waypointsModel - Модель, содержащая всю информацию о точках маршрута.
   */
  constructor(container, waypointsModel, filterModel, filterPresenter) {
    this.#container = container;
    this.#waypointsModel = waypointsModel;
    this.#filterModel = filterModel;
    this.#filterPresenter = filterPresenter;

    this.#waypointsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#filterModelEventHandler);
  }

  get waypoints() {
    let result = this.#waypointsModel.waypoints;

    switch (this.#currentFilter) {
      case FilterType.FUTURE:
        result = this.#filterFutureEvents(result);
        break;
    }

    switch (this.#currentSortType) {
      case SortOptions.day.name:
        result = this.#sortByDay(result);
        break;
      case SortOptions.price.name:
        result = this.#sortByPrice(result);
        break;
    }

    return result;
  }

  /**
   * Отрисовывает базовые элементы.
   */
  init() {
    this.#renderLoading();
    this.#renderWaypointsList();
  }

  /**
   * Создает форму создания новой точки маршрута.
   * @param {function} cancelCallback - колбэк, который будет вызван при закрытии формы.
   */
  createNewWaypointFormComponentView(cancelCallback) {
    this.#waypointPresentersList.forEach((presenter) => {
      presenter.resetView();
    });

    this.#filterModel.setFilter(UpdateType.MINOR, FilterType.EVERYTHING);

    this.#newWaypointPresenter = new NewWaypointPresenter(this.#waypointsListComponent.element, this.#viewActionHandler, this.#waypointsModel.offers, this.#waypointsModel.destinations);
    this.#newWaypointPresenter.init(cancelCallback);
  }

  /**
   * Сортирует точки маршрута по дате.
   * @param {array} waypoints - массив точек маршрута.
   * @returns отсортированные точки маршрута.
   */
  #sortByDay(waypoints) {
    return waypoints.slice()
      .sort((a, b) => a.dateFrom.diff(b.dateFrom));
  }

  /**
   * Сортирует точки маршрута по цене.
   * @param {array} waypoints - массив точек маршрута.
   * @returns отсортированные точки маршрута.
   */
  #sortByPrice(waypoints) {
    return waypoints.slice()
      .sort((a, b) => b.basePrice - a.basePrice);
  }

  /**
   * Оставляет точки маршрута, которые еще не произошли.
   * @param {array} waypoints - массив точек маршрута.
   * @returns отфильтрованные точки маршрута
   */
  #filterFutureEvents(waypoints) {
    return waypoints.slice()
      .filter((a) => a.dateFrom.toDate() >= new Date());
  }

  #renderSort() {
    this.#listSortComponent = new ListSortView(this.waypoints.length, this.#currentSortType);
    render(this.#listSortComponent, this.#container, RenderPosition.AFTERBEGIN);
    this.#listSortComponent.setListener('click', this.#listSortClickHandler);
  }

  #renderWaypointsList() {
    render(this.#waypointsListComponent, this.#container);
  }

  #renderEmptyList() {
    remove(this.#loadingComponent);
    this.#emptyListComponent = new EmptyListView(this.#currentFilter);
    render(this.#emptyListComponent, this.#container);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #renderErrorMessage() {
    this.#errorMessageComponent = new ErrorMessageView();
    render(this.#errorMessageComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  /**
   * Создает презентер под отдельную точку маршрута.
   * @param {array} waypoints - массив точек маршрута.
   */
  #renderWaypoints(waypoints) {
    if (this.#isLoading) {
      return;
    }

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

    if(!this.#isLoading) {
      remove(this.#loadingComponent);
    }

    remove(this.#listSortComponent);
  }

  /**
   * Отрисовывает страницу(сортировка и точки маршрута)
   * @param {array} waypoints - массив точек маршрута.
   */
  #renderBoard(waypoints) {
    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }

    this.#renderSort();
    this.#renderWaypoints(waypoints);
  }

  // #checkFutureEvents

  // Обработчики

  /**
   * Обрабатывает изменения типа сортировки.
   * @param {string} type - выбранный тип сортировки.
   */
  #listSortClickHandler = (type) => {
    switch(type) {
      case 'day':
        this.#currentSortType = SortOptions.day.name;
        break;
      case 'price':
        this.#currentSortType = SortOptions.price.name;
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

  /**
   * Обрабатывает изменения в модели фильтров.
   * @param {object} currentFilter - текущий фильтр.
   */
  #filterModelEventHandler = (_, currentFilter) => {
    this.#currentSortType = this.#currentSortType ? SortOptions.day.name : null;

    if (currentFilter) {
      this.#currentFilter = currentFilter;
    }

    this.#clearBoard();
    this.#renderBoard(this.waypoints);

    if (!this.#filterFutureEvents(this.waypoints).length) {
      this.#filterPresenter.disableFilters(FilterType.FUTURE);
    }
  };

  /**
   * Обрабатывает изменения в модели точек маршрута.
   * @param {string} updateType - тип обновления.
   * @param {object} data - измененнная точка маршрута.
   */
  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#waypointPresentersList.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard(this.waypoints);
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#clearBoard();
        this.#renderBoard(this.waypoints);
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        this.#filterPresenter.disableFilters(FilterType.EVERYTHING, FilterType.FUTURE);
        this.#clearBoard();
        this.#renderErrorMessage();
        break;
    }

    if (!this.#filterFutureEvents(this.waypoints).length) {
      this.#filterPresenter.disableFilters(FilterType.FUTURE);
    }
  };

  /**
   * Обрабатывает изменения в представлении точек маршрута.
   * @param {string} actionType - тип действия.
   * @param {string} updateType - тип обновления.
   * @param {object} update - измененнная точка маршрута.
   */
  #viewActionHandler = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_WAYPOINT:
        this.#waypointPresentersList.get(update.id).setSaving();
        try {
          await this.#waypointsModel.updateWaypoint(updateType, update);
        } catch {
          this.#waypointPresentersList.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_WAYPOINT:
        this.#newWaypointPresenter.setSaving();
        try {
          this.#waypointsModel.addWaypoint(updateType, update);
        } catch {
          this.#newWaypointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_WAYPOINT:
        this.#waypointPresentersList.get(update.id).setDeleting();
        try {
          this.#waypointsModel.deleteWaypoint(updateType, update);
        } catch {
          this.#waypointPresentersList.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };
}
