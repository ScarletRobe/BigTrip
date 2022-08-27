import ListSortView from '../view/list-sort-view.js';
import WaypointsListView from '../view/waypoints-list-view.js';
import WaypointItemView from '../view/waypoint-item-view.js';
import EditWaypointFormView from '../view/edit-waypoint-form-view.js';
import EmptyListView from '../view/empty-list-view.js';

import { render } from '../render.js';
import { TRIP_EVENTS_AMOUNT } from '../consts.js';
import { isEscape } from '../utils.js';

export default class TripEventsPresenter {
  #listSortComponent = new ListSortView();
  #waypointsListComponent = new WaypointsListView();

  #container = null;
  #waypointsModel = null;

  constructor(container, waypointsModel) {
    this.#container = container;
    this.#waypointsModel = waypointsModel;
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
   * Инициализирует презентер. Отрисовывывает базовые элементы.
   * @param {object} container - DOM элемент, в который будут помещены все элементы, созданные в ходе работы.
   * @param {object} waypointsModel - Модель, содержащая всю информацию о местах назначения.
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

  #renderWaypoint(waypoint, selectedDestination, selectedOffers) {
    const waypointComponent = new WaypointItemView(waypoint, selectedDestination, selectedOffers);
    const waypointEditFormComponent = new EditWaypointFormView(waypoint, selectedDestination, selectedOffers, this.#waypointsModel.destinations, this.#waypointsModel.offers);

    const replaceWaypointToEditForm = () => {
      this.#waypointsListComponent.element.replaceChild(waypointEditFormComponent.element, waypointComponent.element);
    };

    const replaceEditFormToWaypoint = () => {
      this.#waypointsListComponent.element.replaceChild(waypointComponent.element, waypointEditFormComponent.element);
      document.removeEventListener('keydown', documentKeydownHandler);
    };

    waypointEditFormComponent.element.querySelector('.event--edit').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceEditFormToWaypoint();
    });
    waypointEditFormComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceEditFormToWaypoint();
    });

    const renderWaypointEditForm = () => {
      replaceWaypointToEditForm();
      document.addEventListener('keydown', documentKeydownHandler);
    };

    waypointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      renderWaypointEditForm();
    });

    render(waypointComponent, this.#waypointsListComponent.element);

    // Обработчики

    function documentKeydownHandler(evt) {
      if (isEscape(evt.code)) {
        evt.preventDefault();
        replaceEditFormToWaypoint();
      }
    }

    // }
  }
}
