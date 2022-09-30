import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeDate, getSelectedDestination, getSelectedOffers, formatDate } from '../utils.js';
import { TYPES } from '../consts.js';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';
import { Russian } from 'flatpickr/dist/l10n/ru.js';

import { getDestinationListOptions } from './templates/destination-list-options.js';
import { getEventTypeItems } from './templates/event-type-items.js';
import { getEventAvailableOffers } from './templates/event-available-offers.js';

/**
 * Генерирует форму редактирования события.
 * @param {object} state - объект с информацией о точке маршрута.
 * @param {object} selectedDestination - объект с информацией о выбранном месте назначения.
 * @param {array} destinations - массив мест назначений.
 * @param {array} offers - массив всех типов событий и дополнительных предложений.
 * @returns {string} строка с HTML кодом.
 */
const getEditWaypointFormTemplate = (state, destinations, offers) => {
  const destination = getSelectedDestination(destinations, state);
  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${state.id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${state.updatedType}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${state.id}" type="checkbox">

              <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                ${getEventTypeItems(state.updatedType, offers)}

              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${state.updatedType}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${getDestinationListOptions(destinations)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(state.updatedDateFrom, 'D/MM/YY HH:mm')}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(state.updatedDateTo, 'D/MM/YY HH:mm')}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${state.updatedBasePrice}">
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

              ${getEventAvailableOffers(state.updatedType, getSelectedOffers(offers, state), offers)}

            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination.description}</p>
          </section>
        </section>
      </form>
    </li>`
  );
};

export default class EditWaypointFormView extends AbstractStatefulView {
  #dateFromPicker = null;
  #dateToPicker = null;
  #validation = {
    basePrice: true,
    destination: true,
  };

  /**
   * @param {object} waypoint - объект с информацией о точке маршрута.
   * @param {object} selectedDestination - объект с информацией о выбранной месте назначения.
   * @param {array} destinations - массив мест назначений.
   * @param {array} offers - массив всех типов событий и дополнительных предложений.
   */
  constructor(waypoint, selectedDestination, destinations, offers) {
    super();
    this.selectedDestination = selectedDestination;
    this.destinations = destinations;
    this.offers = offers;
    this._state = EditWaypointFormView.parseWaypointToState(waypoint);

    this.#setInnerHandlers();
  }

  get template () {
    return getEditWaypointFormTemplate(this._state, this.destinations, this.offers);
  }

  /**
   * Преобразовывает объект с информацией о точке маршрута в объект с информацией о состоянии точки маршрута.
   * @param {object} waypoint - объект с информацией о точке маршрута.
   * @returns {object} state - объект с информацией о состоянии точки маршрута.
   */
  static parseWaypointToState(waypoint) {
    const state = {...waypoint};
    state.updatedType = state.type;
    state.updatedBasePrice = state.basePrice;
    state.updatedDestination = waypoint.destination;
    state.updatedOffers = new Set(waypoint.offers);
    state.updatedDateFrom = waypoint.dateFrom;
    state.updatedDateTo = waypoint.dateTo;

    return state;
  }

  /**
   * Преобразовывает объект с информацией о состоянии точки маршрута в объект с информацией о точке маршрута.
   * @param {object} state - объект с информацией о состоянии точки маршрута.
   * @returns {object} waypoint - объект с информацией о точке маршрута.
   */
  static parseStateToWaypoint(state) {
    const waypoint = state;

    waypoint.offers = [...waypoint.updatedOffers];
    waypoint.type = waypoint.updatedType;
    waypoint.basePrice = waypoint.updatedBasePrice;
    waypoint.dateFrom = waypoint.updatedDateFrom;
    waypoint.dateTo = waypoint.updatedDateTo;

    if (waypoint.updatedDestination !== -1) {
      waypoint.destination = waypoint.updatedDestination;
    }

    delete waypoint.updatedType;
    delete waypoint.updatedBasePrice;
    delete waypoint.updatedDestination;
    delete waypoint.updatedOffers;
    delete waypoint.updatedDateFrom;
    delete waypoint.updatedDateTo;

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
          outerCallback: callback,
        };
        this._handlers[type].cb = this.#setFormSubmitHandler(this._handlers[type].outerCallback);
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
      case 'delete':
        this._handlers[type] = {
          outerCallback: callback,
        };
        this._handlers[type].cb = this.#setFormDeleteHandler(this._handlers[type].outerCallback);
        this._handlers[type].element = '.event__reset-btn';
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

  #setFormDeleteHandler(callback) {
    return (evt) => {
      evt.preventDefault();
      callback(EditWaypointFormView.parseStateToWaypoint(this._state));
    };
  }

  #setInnerHandlers() {
    this.#setDatepickers();
    this.element.querySelector('.event__available-offers').addEventListener('click', this.#availableEventOffersClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('click', this.#eventTypeSelectorClickHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#eventPriceChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#eventDestinationInputHandler);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    for (const handler in this._handlers) {
      this.setListener(handler, this._handlers[handler].outerCallback ?? this._handlers[handler].cb);
    }
  };

  removeElement() {
    super.removeElement();

    if (this.#dateFromPicker && this.#dateToPicker) {
      this.#dateFromPicker.destroy();
      this.#dateToPicker.destroy();
      this.#dateFromPicker = null;
      this.#dateToPicker = null;
    }
  }

  #setDatepickers() {
    const DATEPICKER_CONFIG = {
      dateFormat: 'd/m/y H:i',
      allowInput: true,
      enableTime: true,
      'time_24hr': true,
      locale: Russian,
    };

    this.#dateFromPicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        ...DATEPICKER_CONFIG,
        defaultDate: humanizeDate(this._state.dateFrom, 'D/MM/YY HH:mm'),
        onChange: (date) => this.#eventDateChangeHandler(date, 'dateFrom'),
      }
    );
    this.#dateToPicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        ...DATEPICKER_CONFIG,
        defaultDate: humanizeDate(this._state.dateTo, 'D/MM/YY HH:mm'),
        onChange: (date) => this.#eventDateChangeHandler(date, 'dateTo'),
      }
    );
  }

  #checkValidationError() {
    if (Object.keys(this.#validation).every((validator) => this.#validation[validator])) {
      this.element.querySelector('.event__save-btn').disabled = false;
      return;
    }

    this.element.querySelector('.event__save-btn').disabled = true;
  }

  // Обработчики

  #availableEventOffersClickHandler = (evt) => {
    const element = evt.target.closest('.event__offer-label');
    if (element) {
      const htmlFor = element.htmlFor;
      const id = Number(htmlFor[htmlFor.length - 1]);
      if (!element.control.checked) {
        this._state.updatedOffers.add(id);
      } else {
        this._state.updatedOffers.delete(id);
      }
    }
  };

  #eventTypeSelectorClickHandler = (evt) => {
    const element = evt.target;
    if (element.matches('.event__type-label') && !element.control.checked) {
      const htmlFor = evt.target.htmlFor;
      this._state.updatedOffers.clear();
      this.updateElement({
        updatedType: Object.keys(TYPES).find((type) => TYPES[type].id === Number(htmlFor[htmlFor.length - 1])),
      });
    }
  };

  #eventPriceChangeHandler = (evt) => {
    this.#checkValidationError();
    if(isNaN(evt.target.valueAsNumber)) {
      this.element.querySelector('.event__field-group--price').style.borderBottom = '1px solid red';
      this.#validation.basePrice = false;
    } else {
      this.#validation.basePrice = true;
      this.element.querySelector('.event__field-group--price').style.borderBottom = '1px solid blue';
      this._state.updatedBasePrice = evt.target.value;
    }
    this.#checkValidationError();
  };

  #eventDestinationInputHandler = (evt) => {
    evt.preventDefault();
    this.element.querySelector('.event__field-group--destination').style.borderBottom = '1px solid blue';
    const choosedDestination = this.destinations.find((destination) => destination.name === evt.target.value);
    if (choosedDestination) {
      this.#validation.destination = true;
      this.updateElement({
        updatedDestination: choosedDestination.id,
      });
    } else {
      this.element.querySelector('.event__field-group--destination').style.borderBottom = '1px solid red';
      this.#validation.destination = false;
    }
    this.#checkValidationError();
  };

  #eventDateChangeHandler = ([date], field) => {
    switch(field) {
      case 'dateFrom':
        this._state.updatedDateFrom = formatDate(date);
        break;
      case 'dateTo':
        this._state.updatedDateTo = formatDate(date);
        break;
      default: throw new Error('Incorrect field');
    }
  };
}
