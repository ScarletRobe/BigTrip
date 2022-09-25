import Observable from '../framework/observable.js';
import { FilterType } from '../consts.js';

export default class FilterModel extends Observable {
  #currentFilter = FilterType.Everything;

  get currentFilter() {
    return this.#currentFilter;
  }

  setFilter = (updateType, filter) => {
    this.#currentFilter = filter;
    this._notify(updateType, filter);
  };
}
