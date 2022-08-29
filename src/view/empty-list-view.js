import AbstractView from '../framework/view/abstract-view.js';

/**
 * Возвращает шаблон элемента фильтрации событий.
 * @returns {string} строка с HTML кодом.
 */
const getEmptyListTemplate = () => (
  `<section class="trip-events">
    <h2 class="visually-hidden">Trip events</h2>

    <p class="trip-events__msg">Click New Event to create your first point</p>

    <!--
      Значение отображаемого текста зависит от выбранного фильтра:
        * Everthing – 'Click New Event to create your first point'
        * Past — 'There are no past events now';
        * Future — 'There are no future events now'.
    -->
  </section>`
);

export default class EmptyListView extends AbstractView {
  get template () {
    return getEmptyListTemplate();
  }
}
