import AbstractView from '../framework/view/abstract-view.js';

const loadingTemplate = () => (
  '<p class="trip-events__msg">Loading error. Please try again later.</p>'
);

export default class ErrorMessageView extends AbstractView {
  get template() {
    return loadingTemplate();
  }
}
