import { createElement } from '../render.js';

const getDestinationListOptions = (destinations) => destinations.map((destination) => (`<option value="${destination.name}"></option>`)).join('\n');

const getEventTypeItems = (selectedType, offers) => offers.map((offer) => {
  const checked = offer.type === selectedType ? 'checked' : '';

  return (
    `<div class="event__type-item">
      <input id="event-type-${offer.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type}" ${checked}>
      <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}-1">${offer.type}</label>
    </div>`
  );
}).join('\n');

const getEventAvailableOffers = (selectedType, selectedOffers, offers) => {
  const offersByType = offers.find((offer) => offer.type === selectedType);

  return offersByType.offers.map((offer) => {
    const checked = selectedOffers.some((off) => offer.id === off.id) ? 'checked' : '';
    const offerTitlteWithoutSpaces = offer.title.replaceAll(' ', '-');
    return (
      `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerTitlteWithoutSpaces}-1" type="checkbox" name="event-offer-${offerTitlteWithoutSpaces}" ${checked}>
          <label class="event__offer-label" for="event-offer-${offerTitlteWithoutSpaces}-1">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
      </div>`
    );
  }).join('\n');
};

const getEditWaypointFormTemplate = (waypoint, selectedDestination, selectedOffers, destinations, offers) => (
  `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${waypoint.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

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
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 12:25">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 13:35">
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

export default class EditWaypointFormView {
  constructor(waypoint, selectedDestination, selectedOffers, destinations, offers) {
    this.waypoint = waypoint;
    this.selectedDestination = selectedDestination;
    this.selectedOffers = selectedOffers;
    this.destinations = destinations;
    this.offers = offers;
  }

  getTemplate() {
    return getEditWaypointFormTemplate(this.waypoint, this.selectedDestination, this.selectedOffers, this.destinations, this.offers);
  }

  getElement() {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
