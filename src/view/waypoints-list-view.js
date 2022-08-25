import { createElement } from '../render.js';

/**
 * Возвращает шаблон контейнера для списка мест назначений.
 * @returns {string} строка с HTML кодом.
 */
const getWaypointsListTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class WaypointsListView {
  #element = null;

  get template () {
    return getWaypointsListTemplate();
  }

  get element () {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
