import EditWaypointFormView from '../view/edit-waypoint-form-view.js';
import WaypointItemView from '../view/waypoint-item-view.js';

import { render, replace, remove } from '../framework/render.js';
import { isEscape } from '../utils.js';

export default class WaypointPresenter {
  #waypointComponent = null;
  #waypointEditFormComponent = null;

  #waypointsModel = null;
  #container = null;

  #waypoint = null;
  #selectedDestination = null;
  #selectedOffers = null;

  #modeChangeHandler = null;
  #waypointUpdateHandler = null;

  /**
   *
   * @param {object} waypointsModel - Модель, содержащая всю информацию о точках маршрута.
   * @param {object} container - DOM элемент, в который будут помещены все элементы, созданные в ходе работы.
   * @param {function} modeChangeHandler - колбэк, вызываемый при открытии формы редактирования
   * @param {function} waypointUpdateHandler - колбэк, вызываемый при изменении данных о точке маршрута.
   */
  constructor(waypointsModel, container, modeChangeHandler, waypointUpdateHandler) {
    this.#waypointsModel = waypointsModel;
    this.#container = container;
    this.#modeChangeHandler = modeChangeHandler;
    this.#waypointUpdateHandler = waypointUpdateHandler;
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
    return offersList.offers.filter((offer) => waypoint.offers.some((offerId) => offerId === offer.id));
  }

  #replaceWaypointToEditForm() {
    replace(this.#waypointEditFormComponent, this.#waypointComponent);
  }

  #replaceEditFormToWaypoint() {
    replace(this.#waypointComponent, this.#waypointEditFormComponent);
    this.#waypointEditFormComponent.removeListeners();
    this.#waypointEditFormComponent.removeElement();
    remove(this.#waypointEditFormComponent);
    this.#waypointEditFormComponent = null;
    document.removeEventListener('keydown', this.#documentKeydownHandler);
  }

  #renderWaypointEditForm() {
    this.#waypointEditFormComponent = new EditWaypointFormView(this.#waypoint, this.#selectedDestination, this.#selectedOffers, this.#waypointsModel.destinations, this.#waypointsModel.offers);

    this.#waypointEditFormComponent.setListener('submit', this.#waypointEditFormSubmitHandler);
    this.#waypointEditFormComponent.setListener('clickOnRollupBtn', this.#waypointEditFormRollupBtnClickHandler);

    document.addEventListener('keydown', this.#documentKeydownHandler);

    this.#replaceWaypointToEditForm();
  }

  /**
   *
   * @param {object} waypoint - объект с информацией о месте назначения.
   * @param {object} selectedDestination - объект с информацией о выбранном месте назначения.
   * @param {array} selectedOffers - массив выбранных дополнительных предложений.
   */
  #renderWaypointItem(waypoint, selectedDestination, selectedOffers) {
    this.#waypointComponent = new WaypointItemView(waypoint, selectedDestination, selectedOffers);
    this.#waypointComponent.setListener('clickOnRollupBtn', this.#waypointRollupBtnClickHandler);

    render(this.#waypointComponent, this.#container);
  }

  destroyWaypoint() {
    remove(this.#waypointComponent);
    remove(this.#waypointEditFormComponent);
  }

  resetView() {
    if(this.#waypointEditFormComponent) {
      this.#replaceEditFormToWaypoint();
    }
  }

  /**
   * Отрисовывает точку маршрута
   * @param {object} waypoint - объект с информацией о месте назначения.
   */
  init(waypoint) {
    const prevWaypointComponent = this.#waypointComponent;
    const prevWaypointEditFormComponent = this.#waypointEditFormComponent;

    this.#waypoint = waypoint;
    this.#selectedDestination = this.#getSelectedDestination(waypoint);
    this.#selectedOffers = this.#getSelectedOffers(waypoint);


    if (prevWaypointComponent === null || prevWaypointEditFormComponent === null) {
      this.#renderWaypointItem(this.#waypoint, this.#selectedDestination, this.#selectedOffers);
      return;
    }

    this.#waypointComponent = new WaypointItemView(waypoint, this.#selectedDestination, this.#selectedOffers);
    this.#waypointComponent.setListener('clickOnRollupBtn', this.#waypointRollupBtnClickHandler);

    if (prevWaypointEditFormComponent) {
      this.#replaceEditFormToWaypoint();
      remove(prevWaypointEditFormComponent);
      remove(prevWaypointComponent);
      return;
    }

    replace(this.#waypointComponent, prevWaypointComponent);
    remove(prevWaypointComponent);
  }

  // Обработчики

  #documentKeydownHandler = (evt) => {
    if (isEscape(evt.code)) {
      evt.preventDefault();
      this.#replaceEditFormToWaypoint();
    }
  };

  #waypointRollupBtnClickHandler = () => {
    this.#modeChangeHandler();
    this.#renderWaypointEditForm();
  };

  #waypointEditFormRollupBtnClickHandler = () => {
    this.#replaceEditFormToWaypoint();
  };

  #waypointEditFormSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#waypointUpdateHandler(this.#waypoint);
  };
}
