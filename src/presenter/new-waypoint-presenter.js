import NewWaypointFormView from '../view/new-waypoint-form-view.js';

import { UserAction, UpdateType } from '../consts.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import { isEscape } from '../utils.js';


export default class NewWaypointPresenter {
  #container = null;
  #addWaypointHandler = null;
  #cancelCallback = null;
  #newWaypointFormComponent = null;
  #offers = null;
  #destinations = null;

  constructor(container, addWaypointHandler, offers, destinations) {
    this.#container = container;
    this.#addWaypointHandler = addWaypointHandler;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  /**
   *
   * @param {function} cancelCallback - фукнция, которая будет вызвана при отмене формы создания новой точки маршрута.
   */
  init(cancelCallback) {
    this.#cancelCallback = cancelCallback;

    if (this.#newWaypointFormComponent) {
      return;
    }

    this.#newWaypointFormComponent = new NewWaypointFormView(this.#offers, this.#destinations);
    render(this.#newWaypointFormComponent, this.#container, RenderPosition.AFTERBEGIN);

    this.#newWaypointFormComponent.setListener('submit', this.#newWaypointFormSubmitHandler);
    this.#newWaypointFormComponent.setListener('cancel', this.#newWaypointFormCancelHandler);

    document.addEventListener('keydown', this.#documentKeydownHandler);
  }

  destroy() {
    if (!this.#newWaypointFormComponent) {
      return;
    }

    this.#cancelCallback?.();

    remove(this.#newWaypointFormComponent);
    this.#newWaypointFormComponent = null;

    document.removeEventListener('keydown', this.#documentKeydownHandler);
  }

  setSaving = () => {
    this.#newWaypointFormComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting() {
    const resetFormState = () => {
      this.#newWaypointFormComponent.updateElement({
        isDisabled: false,
        isSaving: false,
      });
    };

    this.#newWaypointFormComponent.shake(resetFormState);
  }

  // Обработчики

  /**
   * Обрабатывает отправку формы создания новой точки маршрута.
   * @param {object} waypoint - точка маршрута.
   */
  #newWaypointFormSubmitHandler = (waypoint) => {
    this.#addWaypointHandler(
      UserAction.ADD_WAYPOINT,
      UpdateType.MINOR,
      waypoint,
    );
    // this.destroy();
  };

  #newWaypointFormCancelHandler = () =>{
    this.destroy();
  };

  /**
   * Обрабатывает нажатие клавиши.
   * @param {object} evt - объект события
   */
  #documentKeydownHandler = (evt) => {
    if (isEscape(evt.code)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}
