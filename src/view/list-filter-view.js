import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../consts.js';
import { capitalizeFirstLetter } from '../utils.js';

const getTripFilters = (currentFilter) => (
  Object.keys(FilterType).map((filter) => (
    `<div class="trip-filters__filter">
      <input id="filter-${FilterType[filter]}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${FilterType[filter]}" ${currentFilter === FilterType[filter] ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-${FilterType[filter]}">${capitalizeFirstLetter(FilterType[filter])}</label>
    </div>`
  )).join('\n')
);

/**
 * Возвращает шаблон элемента фильтрации событий.
 * @returns {string} строка с HTML кодом.
 */
const getListFilterTemplate = (currentFilter) => (
  `<div>
    <form class="trip-filters" action="#" method="get">

    ${getTripFilters(currentFilter)}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  </div>`
);

export default class ListFilterView extends AbstractView {
  #currentFilter = null;
  #isDisabled = {
    [FilterType.EVERYTHING]: false,
    [FilterType.FUTURE]: false,
  };

  constructor(currentFilter) {
    super();
    this.#currentFilter = currentFilter;
  }

  get template () {
    return getListFilterTemplate(this.#currentFilter);
  }

  /**
  * Устанавливает обработчик событий для формы редактирования
  * @param {string} type - тип отслеживаемого события.
  * @param {function} callback - функция, вызываемая при активации события
  */
  setListener (type, callback) {
    this._handlers[type] = {};
    switch (type) {
      case 'changeFilter':
        this._handlers[type].cb = this.#filterTypeChangeHandler(callback);
        this._handlers[type].element = '.trip-filters';
        this._handlers[type].type = 'click';
        break;
      default:
        throw new Error('Unknown type of event for this view');
    }
    this.element.querySelector(this._handlers[type].element).addEventListener(this._handlers[type].type, this._handlers[type].cb);
  }

  disableFilter(filterName) {
    // this.#isDisabled[filterName] = true;
    this.element.querySelector(`#filter-${filterName}`).disabled = true;
  }

  #filterTypeChangeHandler = (callback) => (
    (evt) => {
      if(evt.target.matches('.trip-filters__filter-input') && evt.target.disabled === false) {
        evt.preventDefault();
        callback(evt.target.value);
      }
    }
  );
}
