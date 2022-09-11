import { humanizeDate } from '../utils.js';
import { TYPES, CITIES } from '../consts.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getDestinationListOptions } from './templates/destination-list-options.js';
import { getEventTypeItems } from './templates/event-type-items.js';
import { getEventAvailableOffers } from './templates/event-available-offers.js';

/**
 * Генерирует форму редактирования события.
 * @param {object} waypoint - объект с информацией о месте назначения.
 * @param {object} selectedDestination - объект с информацией о выбранном месте назначения.
 * @param {array} selectedOffers - массив id выбранных дополнительных предложений.
 * @param {array} destinations - массив мест назначений.
 * @param {array} offers - массив всех типов событий и дополнительных предложений.
 * @returns {string} строка с HTML кодом.
 */
const getEditWaypointFormTemplate = (waypoint, selectedDestination, selectedOffers, destinations, offers) => (
  `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${waypoint.id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${waypoint.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${waypoint.id}" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              ${getEventTypeItems(waypoint.type, offers)}

            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${waypoint.type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${selectedDestination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${getDestinationListOptions(destinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(waypoint.dateFrom, 'D/MM/YY HH:mm')}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(waypoint.dateTo, 'D/MM/YY HH:mm')}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${waypoint.basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">

            ${getEventAvailableOffers(waypoint.type, selectedOffers, offers)}

          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${selectedDestination.description}</p>
        </section>
      </section>
    </form>
  </li>`
);

export default class EditWaypointFormView extends AbstractStatefulView {
  /**
   * @param {object} waypoint - объект с информацией о месте назначения.
   * @param {object} selectedDestination - объект с информацией о выбранном месте назначения.
   * @param {array} selectedOffers - массив выбранных дополнительных предложений.
   * @param {array} destinations - массив мест назначений.
   * @param {array} offers - массив всех типов событий и дополнительных предложений.
   */
  constructor(waypoint, selectedDestination, selectedOffers, destinations, offers) {
    super();
    this.selectedDestination = selectedDestination;
    this.selectedOffers = selectedOffers;
    this.destinations = destinations;
    this.offers = offers;
    this._state = waypoint;


    this.element.querySelector('.event__available-offers').addEventListener('click', this.#availableEventOffersClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('click', this.#eventTypeSelectorClickHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#eventPriceInputHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#eventDestinationInputHandler);
  }

  get template () {
    return getEditWaypointFormTemplate(this._state, this.selectedDestination, this.selectedOffers, this.destinations, this.offers);
  }

  static parseWaypointToState(waypoint) {
    return waypoint;
  }

  static parseStateToWaypoint(state) {
    const waypoint = state;

    if (waypoint.updatedOffers) {
      waypoint.offers = [...waypoint.updatedOffers];

      delete waypoint.updatedOffers;
    }

    if (waypoint.updatedType) {
      for (const type in TYPES) {
        if (TYPES[type].id === waypoint.updatedType) {
          waypoint.type = type;
        }
      }

      delete waypoint.updatedType;
    }

    if (waypoint.updatedBasePrice) {
      waypoint.basePrice = waypoint.updatedBasePrice;

      delete waypoint.updatedBasePrice;
    }

    if (waypoint.updatedDestination && waypoint.updatedDestination !== -1) {
      waypoint.destination = waypoint.updatedDestination;

      delete waypoint.updatedDestination;
    }

    return waypoint;
  }

  /**
   * Устанавливает обработчик событий для формы редактирования
   * @param {string} type - тип отслеживаемого события.
   * @param {function} callback - функция, вызываемая при активации события
   */
  setListener (type, callback) {
    switch (type) {
      case 'submit':
        this._handlers[type] = {
          cb: this.#setFormSubmitHandler(callback),
        };
        this._handlers[type].element = '.event--edit';
        this._handlers[type].type = 'submit';
        break;
      case 'clickOnRollupBtn':
        this._handlers[type] = {
          cb: callback,
        };
        this._handlers[type].element = '.event__rollup-btn';
        this._handlers[type].type = 'click';
        break;
      default:
        throw new Error('Unknown type of event for this view');
    }
    this.element.querySelector(this._handlers[type].element).addEventListener(this._handlers[type].type, this._handlers[type].cb);
  }

  #setFormSubmitHandler(callback) {
    return (evt) => {
      evt.preventDefault();
      callback(EditWaypointFormView.parseStateToWaypoint(this._state));
    };
  }

  #availableEventOffersClickHandler = (evt) => {
    const element = evt.target.closest('.event__offer-label');
    if (element) {
      const htmlFor = element.htmlFor;
      const id = Number(htmlFor[htmlFor.length - 1]);
      this._state.updatedOffers = this._state.updatedOffers ?? new Set(this._state.offers);
      if (!element.control.checked) {
        this._state.updatedOffers.add(id);
      } else {
        this._state.updatedOffers.delete(id);
      }
    }
  };

  // TODO: перерисовка при клике на тип
  #eventTypeSelectorClickHandler = (evt) => {
    const element = evt.target;
    if (element.matches('.event__type-label') && !element.control.checked) {
      const htmlFor = evt.target.htmlFor;
      this._state.updatedType = Number(htmlFor[htmlFor.length - 1]);
    }
  };

  // TODO: Нужно ли отдельное св-во
  #eventPriceInputHandler = (evt) => {
    this._state.updatedBasePrice = evt.target.value;
  };

  // TODO: перерисовка при смене/структура cities
  #eventDestinationInputHandler = (evt) => {
    if (evt.target.value) {
      this._state.updatedDestination = CITIES.findIndex((city) => city === evt.target.value) + 1;
    }
  };
}
