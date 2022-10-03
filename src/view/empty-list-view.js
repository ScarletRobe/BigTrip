import AbstractView from '../framework/view/abstract-view.js';

import { FilterType } from '../consts.js';

/**
 * Возвращает шаблон элемента фильтрации событий.
 * @returns {string} строка с HTML кодом.
 */
const getEmptyListTemplate = (currentFilter) => (
  `<section class="trip-events">
    <h2 class="visually-hidden">Trip events</h2>

    <p class="trip-events__msg">${currentFilter === FilterType.EVERYTHING ? 'Click New Event to create your first point' : 'There are no future events now'}</p>

    <!--
      Значение отображаемого текста зависит от выбранного фильтра:
        * Everthing – 'Click New Event to create your first point'
        * Past — 'There are no past events now';
        * Future — 'There are no future events now'.
    -->
  </section>`
);

export default class EmptyListView extends AbstractView {
  #currentFilter = null;

  constructor(currentFilter) {
    super();
    this.#currentFilter = currentFilter;
  }

  get template () {
    return getEmptyListTemplate(this.#currentFilter);
  }
}
