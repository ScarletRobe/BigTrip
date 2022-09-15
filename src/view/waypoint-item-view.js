import AbstractView from '../framework/view/abstract-view.js';
import { humanizeDate } from '../utils.js';

/**
 * Генерирует информацию о выбранных дополнительных предложениях.
 * @param {array} offers - массив всех типов событий и дополнительных предложений.
 * @returns {string} строка с HTML кодом.
 */
const getEventOffers = (offers) => offers.map((offer) => (
  `<li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>`
)).join('\n');

/**
 * Генерирует разметку карточки с информацией о точке маршрута.
 * @param {object} waypoint - объект с информацией о точке маршрута.
 * @param {object} selectedDestination - объект с информацией о выбранном месте назначения.
 * @param {array} offers - массив всех типов событий и дополнительных предложений.
 * @returns {string} строка с HTML кодом.
 */
const getWaypointItemTemplate = (waypoint, selectedDestination, offers) => (
  `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${waypoint.dateFrom}">${humanizeDate(waypoint.dateFrom, 'MMM D')}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${waypoint.type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${waypoint.type} ${selectedDestination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${waypoint.dateFrom}">${humanizeDate(waypoint.dateFrom, 'HH:mm')}</time>
          &mdash;
          <time class="event__end-time" datetime="${waypoint.dateTo}">${humanizeDate(waypoint.dateTo, 'HH:mm')}</time>
        </p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${waypoint.basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${getEventOffers(offers)}
      </ul>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
);

export default class WaypointItemView extends AbstractView {
  /**
   * @param {object} waypoint - объект с информацией о точке маршрута.
   * @param {object} selectedDestination - объект с информацией о выбранном месте назначения.
   * @param {array} offers - массив всех типов событий и дополнительных предложений.
   */
  constructor(waypoint, selectedDestination, offers) {
    super();
    this.waypoint = waypoint;
    this.selectedDestination = selectedDestination;
    this.offers = offers;
  }

  get template () {
    return getWaypointItemTemplate(this.waypoint, this.selectedDestination, this.offers);
  }

  /**
   * Устанавливает обработчик событий для формы редактирования
   * @param {string} type - тип отслеживаемого события.
   * @param {function} callback - функция, вызываемая при активации события
   */
  setListener (type, callback) {
    this._handlers[type] = {
      cb: callback,
    };
    switch (type) {
      case 'clickOnRollupBtn':
        this._handlers[type].element = '.event__rollup-btn';
        this._handlers[type].type = 'click';
        break;
      default:
        throw new Error('Unknown type of event for this view');
    }
    this.element.querySelector(this._handlers[type].element).addEventListener(this._handlers[type].type, this._handlers[type].cb);
  }
}
