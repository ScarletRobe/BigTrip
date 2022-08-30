import AbstractView from '../framework/view/abstract-view.js';
import { SORT_OPTIONS } from '../consts.js';
import { capitalizeFirstLetter } from '../utils.js';

const generateTripSortItems = (waypointsAmount) => {
  const disabled = waypointsAmount ? '' : 'disabled';
  return SORT_OPTIONS.map((option) => (
    `<div class="trip-sort__item  trip-sort__item--${option}">
    <input id="sort-${option}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${option}" ${disabled}>
    <label class="trip-sort__btn" for="sort-${option}">${capitalizeFirstLetter(option)}</label>
    </div>`)
  ).join('\n');
};

/**
 * Возвращает шаблон элемента сортировки событий.
 * @returns {string} строка с HTML кодом.
 */
const getListSortElement = (waypointsAmount) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">

    ${generateTripSortItems(waypointsAmount)}

  </form>`
);

export default class ListSortView extends AbstractView {
  constructor(waypointsAmount) {
    super();
    this.waypointsAmount = waypointsAmount;
  }

  get template () {
    return getListSortElement(this.waypointsAmount);
  }
}
