import ListFilterView from '../view/list-filter-view.js';

import { render, replace, remove } from '../framework/render.js';
import { UpdateType } from '../consts.js';

export default class FilterPresenter {
  #container = null;
  #filterModel = null;
  #waypointsModel = null;
  #filterComponent = null;

  constructor(waypointsModel, filterModel, container) {
    this.#waypointsModel = waypointsModel;
    this.#filterModel = filterModel;
    this.#container = container;

    this.#waypointsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  init() {
    const prevFilterComponent = this.#filterComponent;
    this.#filterComponent = new ListFilterView(this.#filterModel.currentFilter);
    this.#filterComponent.setListener('changeFilter', this.#filterTypeChangeHandler);

    if (!prevFilterComponent) {
      render(this.#filterComponent, this.#container);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #modelEventHandler = () => {
    this.init();
  };

  /**
   * Обрабатывает смену типа фильтра
   * @param {string} filterType - тип выбранного фильтра
   */
  #filterTypeChangeHandler = (filterType) => {
    if (this.#filterModel.currentFilter === filterType) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
