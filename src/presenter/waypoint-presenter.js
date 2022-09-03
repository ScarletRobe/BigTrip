import EditWaypointFormView from '../view/edit-waypoint-form-view.js';
import WaypointItemView from '../view/waypoint-item-view.js';

import { render, replace } from '../framework/render.js';
import { isEscape } from '../utils.js';

export default class WaypointPresenter {
  #waypointComponent = null;
  #waypointEditFormComponent = null;

  #waypointsModel = null;
  #container = null;

  #waypoint = null;
  #selectedDestination = null;
  #selectedOffers = null;

  #bindedDocumentKeydownHandler = null;

  constructor(waypointsModel, container) {
    this.#waypointsModel = waypointsModel;
    this.#container = container;
  }

  /**
   * Ищет выбранное место назначения.
   * @param {object} waypoint - объект с информацией о месте назначения..
   * @returns {object} объект с информацией о выбранном месте назначения.
   */
  #getSelectedDestination(waypoint) {
    return this.#waypointsModel.destinations.find((dest) => dest.id === waypoint.destination);
  }

  /**
   * Ищет информацию о выбранных дополнительных предложениях.
   * @param {object} waypoint - объект с информацией о месте назначения.
   * @returns {array} массив объектов.
   */
  #getSelectedOffers(waypoint) {
    const offersList = this.#waypointsModel.offers.find((offer) => offer.type === waypoint.type);
    const offers = [];
    waypoint.offers.forEach((offerId) => {
      offers.push(offersList.offers.find((offer) => offer.id === offerId));
    });
    return offers;
  }

  #replaceWaypointToEditForm(waypointEditFormComponent) {
    replace(waypointEditFormComponent, this.#waypointComponent);
  }

  #replaceEditFormToWaypoint(waypointEditFormComponent) {
    replace(this.#waypointComponent, waypointEditFormComponent);
    waypointEditFormComponent.removeListeners();
    waypointEditFormComponent.removeElement();
    waypointEditFormComponent = null;
    document.removeEventListener('keydown', this.#bindedDocumentKeydownHandler);
  }

  #renderWaypointEditForm() {
    this.#waypointEditFormComponent = new EditWaypointFormView(this.#waypoint, this.#selectedDestination, this.#selectedOffers, this.#waypointsModel.destinations, this.#waypointsModel.offers);

    this.#waypointEditFormComponent.setListener('submit', (evt) => {
      evt.preventDefault();
      this.#replaceEditFormToWaypoint(this.#waypointEditFormComponent);
    });
    this.#waypointEditFormComponent.setListener('clickOnRollupBtn', () => {
      this.#replaceEditFormToWaypoint(this.#waypointEditFormComponent);
    });

    this.#bindedDocumentKeydownHandler = this.#documentKeydownHandler.bind(this);
    document.addEventListener('keydown', this.#bindedDocumentKeydownHandler);

    this.#replaceWaypointToEditForm(this.#waypointEditFormComponent);
  }

  #renderWaypointItem(waypoint, selectedDestination, selectedOffers) {
    this.#waypointComponent = new WaypointItemView(waypoint, selectedDestination, selectedOffers);
    this.#waypointComponent.setListener('clickOnRollupBtn', () => {
      this.#renderWaypointEditForm();
    });

    render(this.#waypointComponent, this.#container);
  }

  init(waypoint) {
    this.#waypoint = waypoint;
    this.#selectedDestination = this.#getSelectedDestination(waypoint);
    this.#selectedOffers = this.#getSelectedOffers(waypoint);

    this.#renderWaypointItem(this.#waypoint, this.#selectedDestination, this.#selectedOffers);
  }

  // Обработчики

  #documentKeydownHandler(evt) {
    if (isEscape(evt.code)) {
      evt.preventDefault();
      this.#replaceEditFormToWaypoint(this.#waypointEditFormComponent);
    }
  }
}
