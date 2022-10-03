import Observable from '../framework/observable.js';
import { FilterType } from '../consts.js';

export default class FilterModel extends Observable {
  #currentFilter = FilterType.Everything;

  get currentFilter() {
    return this.#currentFilter;
  }

  /**
   * Устанавливает текущий фильтр.
   * @param {string} updateType - тип обновления.
   * @param {string} filter - выбранный фильтр.
   */
  setFilter = (updateType, filter) => {
    this.#currentFilter = filter;
    this._notify(updateType, filter);
  };
}
