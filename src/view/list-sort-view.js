import AbstractView from '../framework/view/abstract-view.js';
import { SORT_OPTIONS, AVAILABLE_SORT_OPTIONS } from '../consts.js';
import { capitalizeFirstLetter } from '../utils.js';

const generateTripSortItems = (waypointsAmount) => SORT_OPTIONS.map((option) => {
  const disabled = waypointsAmount && AVAILABLE_SORT_OPTIONS.includes(option) ? '' : 'disabled';
  return `<div class="trip-sort__item  trip-sort__item--${option}">
  <input id="sort-${option}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${option}" ${disabled}>
  <label class="trip-sort__btn" for="sort-${option}" data-sort-type="${option}">${capitalizeFirstLetter(option)}</label>
  </div>`;
}).join('\n');

/**
 * Возвращает шаблон элемента сортировки событий.
 * @returns {string} строка с HTML кодом.
 */
const getListSortElement = (waypointsAmount) => (
  `<div>
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">

      ${generateTripSortItems(waypointsAmount)}

    </form>
  </div>`
);

export default class ListSortView extends AbstractView {
  constructor(waypointsAmount) {
    super();
    this.waypointsAmount = waypointsAmount;
  }

  get template () {
    return getListSortElement(this.waypointsAmount);
  }

  #setSortClickHandler(callback) {
    return (evt) => {
      if (evt.target.tagName === 'LABEL' && AVAILABLE_SORT_OPTIONS.includes(evt.target.dataset.sortType) && !evt.target.control.checked) {
        evt.preventDefault();
        callback(evt.target.dataset.sortType);
        evt.target.control.checked = true;
      }
    };
  }

  /**
   * Устанавливает обработчик событий для формы редактирования
   * @param {string} type - тип отслеживаемого события.
   * @param {function} callback - функция, вызываемая при активации события
   */
  setListener (type, callback) {
    this._handlers[type] = {
      cb: this.#setSortClickHandler(callback),
    };
    switch (type) {
      case 'click':
        this._handlers[type].element = '.trip-events__trip-sort';
        this._handlers[type].type = 'click';
        break;
      default:
        throw new Error('Unknown type of event for this view');
    }
    this.element.querySelector(this._handlers[type].element).addEventListener(this._handlers[type].type, this._handlers[type].cb);
  }


}
