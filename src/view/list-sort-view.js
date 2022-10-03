import AbstractView from '../framework/view/abstract-view.js';
import { SORT_OPTIONS } from '../consts.js';
import { capitalizeFirstLetter } from '../utils.js';

const generateTripSortItems = (waypointsAmount, currentSortType) => Object.keys(SORT_OPTIONS).map((option) => {
  const disabled = waypointsAmount && SORT_OPTIONS[option].sort ? '' : 'disabled';
  return `<div class="trip-sort__item  trip-sort__item--${option}">
  <input id="sort-${option}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${option}" ${disabled} ${waypointsAmount && option === currentSortType ? 'checked' : ''}>
  <label class="trip-sort__btn" for="sort-${option}" data-sort-type="${option}">${capitalizeFirstLetter(option)}</label>
  </div>`;
}).join('\n');

/**
 * Возвращает шаблон элемента сортировки событий.
 * @returns {string} строка с HTML кодом.
 */
const getListSortElement = (waypointsAmount, currentSortType) => (
  `<div>
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">

      ${generateTripSortItems(waypointsAmount, currentSortType)}

    </form>
  </div>`
);

export default class ListSortView extends AbstractView {
  #currentSortType = null;

  constructor(waypointsAmount, currentSortType) {
    super();
    this.waypointsAmount = waypointsAmount;
    this.#currentSortType = currentSortType;
  }

  get template () {
    return getListSortElement(this.waypointsAmount, this.#currentSortType);
  }

  /**
   * Устанавливает обработчик событий для формы редактирования
   * @param {string} type - тип отслеживаемого события.
   * @param {function} callback - функция, вызываемая при активации события
   */
  setListener (type, callback) {
    switch (type) {
      case 'click':
        this._handlers[type] = {
          cb: this.#setSortClickHandler(callback),
        };
        this._handlers[type].element = '.trip-events__trip-sort';
        this._handlers[type].type = 'click';
        break;
      default:
        throw new Error('Unknown type of event for this view');
    }
    this.element.querySelector(this._handlers[type].element).addEventListener(this._handlers[type].type, this._handlers[type].cb);
  }

  #setSortClickHandler(callback) {
    return (evt) => {
      if (evt.target.tagName === 'LABEL' && SORT_OPTIONS[evt.target.dataset.sortType].sort && !evt.target.control.checked && !evt.target.control.disabled) {
        evt.preventDefault();
        callback(evt.target.dataset.sortType);
        evt.target.control.checked = true;
      }
    };
  }
}
