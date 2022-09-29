import AbstractView from '../framework/view/abstract-view.js';

/**
 * Возвращает шаблон контейнера для списка мест назначений.
 * @returns {string} строка с HTML кодом.
 */
const getWaypointsListTemplate = () => (
  `<div>
    <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>
  </div>`
);

export default class AddEventBtnView extends AbstractView {
  get template () {
    return getWaypointsListTemplate();
  }

  manageDisable(isDisable) {
    this.element.querySelector('.trip-main__event-add-btn').disabled = isDisable;
  }

  setListener (type, callback) {
    switch (type) {
      case 'click':
        this._handlers[type] = {
          cb: callback
        };
        this._handlers[type].element = '.trip-main__event-add-btn';
        this._handlers[type].type = 'click';
        break;
      default:
        throw new Error('Unknown type of event for this view');
    }
    this.element.querySelector(this._handlers[type].element).addEventListener(this._handlers[type].type, this._handlers[type].cb);
  }
}
