import AbstractView from '../framework/view/abstract-view.js';

/**
 * Возвращает шаблон контейнера для списка мест назначений.
 * @returns {string} строка с HTML кодом.
 */
const getWaypointsListTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class WaypointsListView extends AbstractView {
  get template () {
    return getWaypointsListTemplate();
  }
}
