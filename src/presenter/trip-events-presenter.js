import ListSortView from '../view/list-sort-view.js';
import WaypointsListView from '../view/waypoints-list-view.js';
import WaypointItemView from '../view/waypoint-item-view.js';
import EditWaypointFormView from '../view/edit-waypoint-form-view.js';
import EmptyListView from '../view/empty-list-view.js';

import { render, replace } from '../framework/render.js';
import { TRIP_EVENTS_AMOUNT } from '../consts.js';
import { isEscape } from '../utils.js';

export default class TripEventsPresenter {
  #listSortComponent = null;
  #waypointsListComponent = new WaypointsListView();

  #container = null;
  #waypointsModel = null;

  /**
   * @param {object} container - DOM элемент, в который будут помещены все элементы, созданные в ходе работы.
   * @param {object} waypointsModel - Модель, содержащая всю информацию о местах назначения.
   */
  constructor(container, waypointsModel) {
    this.#container = container;
    this.#waypointsModel = waypointsModel;
    this.#listSortComponent = new ListSortView(this.#waypointsModel.waypoints.length);
  }

  /**
   * Ищет выбранное место назначения.
   * @param {object} waypoint - объект с информацией о месте назначения..
   * @returns {object} объект с информацией о выбранном месте назначения.
   */
  getSelectedDestination(waypoint) {
    return this.#waypointsModel.destinations.find((dest) => dest.id === waypoint.destination);
  }

  /**
   * Ищет информацию о выбранных дополнительных предложениях.
   * @param {object} waypoint - объект с информацией о месте назначения.
   * @returns {array} массив объектов.
   */
  getSelectedOffers(waypoint) {
    const offersList = this.#waypointsModel.offers.find((offer) => offer.type === waypoint.type);
    const offers = [];
    waypoint.offers.forEach((offerId) => {
      offers.push(offersList.offers.find((offer) => offer.id === offerId));
    });
    return offers;
  }

  /**
   * Отрисовывывает базовые элементы.
   */
  init = () => {
    render(this.#listSortComponent, this.#container);
    render(this.#waypointsListComponent, this.#container);

    if (!this.#waypointsModel.waypoints.length) {
      render(new EmptyListView(), this.#container);
    }
    for (let i = 0; i < TRIP_EVENTS_AMOUNT; i++) {
      this.#renderWaypoint(this.#waypointsModel.waypoints[i], this.getSelectedDestination(this.#waypointsModel.waypoints[i]), this.getSelectedOffers(this.#waypointsModel.waypoints[i]));
    }
  };

  /**
   *
   * @param {object} waypoint - объект с информацией о месте назначения.
   * @param {object} selectedDestination - объект с информацией о выбранном месте назначения.
   * @param {array} selectedOffers - массив id выбранных дополнительных предложений.
   */
  #renderWaypoint(waypoint, selectedDestination, selectedOffers) {
    const currentWaypoint = waypoint;
    const currentDestination = selectedDestination;
    const currentOffers = selectedOffers;

    const waypointComponent = new WaypointItemView(waypoint, selectedDestination, selectedOffers);

    const replaceWaypointToEditForm = (waypointEditFormComponent) => {
      replace(waypointEditFormComponent, waypointComponent);
    };

    const replaceEditFormToWaypoint = (waypointEditFormComponent) => {
      replace(waypointComponent, waypointEditFormComponent);
      waypointEditFormComponent.removeListeners();
      waypointEditFormComponent.removeElement();
      waypointEditFormComponent = null;
      document.removeEventListener('keydown', documentKeydownHandler);
    };

    const renderWaypointEditForm = () => {
      const waypointEditFormComponent = new EditWaypointFormView(currentWaypoint, currentDestination, currentOffers, this.#waypointsModel.destinations, this.#waypointsModel.offers);

      waypointEditFormComponent.setListener('submit', (evt) => {
        evt.preventDefault();
        replaceEditFormToWaypoint(waypointEditFormComponent);
      });
      waypointEditFormComponent.setListener('clickOnRollupBtn', () => {
        replaceEditFormToWaypoint(waypointEditFormComponent);
      });

      document.addEventListener('keydown', documentKeydownHandler);

      replaceWaypointToEditForm(waypointEditFormComponent);
    };

    waypointComponent.setListener('clickOnRollupBtn', () => {
      renderWaypointEditForm();
    });

    render(waypointComponent, this.#waypointsListComponent.element);

    // Обработчики

    /**
     * Обрабатывает нажатия клавиш при открытой форме редактирования
     * @param {object} evt - event
     */
    function documentKeydownHandler(evt) {
      if (isEscape(evt.code)) {
        evt.preventDefault();
        replaceEditFormToWaypoint();
      }
    }
  }
}
