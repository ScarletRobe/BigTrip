import { createElement } from '../render.js';

const getEventOffers = (offers) => {
  let result = '';
  offers.forEach((offer) => {
    result += (
      `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`
    );
  });
  return result;
};

const getWaypointItemTemplate = (waypoint, destination, offers) => (
  `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="2019-03-18">MAR 18</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${waypoint.type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${waypoint.type} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <!-- TODO: Date -->
          <time class="event__start-time" datetime="2019-03-18T10:30">10:30</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T11:00">11:00</time>
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

export default class WaypointItemView {
  constructor(waypoint, destination, offers) {
    this.waypoint = waypoint;
    this.destination = destination;
    this.offers = offers;
  }

  getTemplate() {
    return getWaypointItemTemplate(this.waypoint, this.destination, this.offers);
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
