import EditWaypointFormView from '../view/edit-waypoint-form-view.js';
import WaypointItemView from '../view/waypoint-item-view.js';

import { render, replace, remove } from '../framework/render.js';
import { isEscape, getSelectedDestination, getSelectedOffers } from '../utils.js';
import { UserAction, UpdateType } from '../consts.js';

export default class WaypointPresenter {
  #waypointComponent = null;
  #waypointEditFormComponent = null;

  #waypointsModel = null;
  #container = null;

  #waypoint = null;
  #selectedDestination = null;
  #selectedOffers = null;

  #modeChangeHandler = null;
  #waypointUpdateHandler = null;

  /**
   *
   * @param {object} waypointsModel - Модель, содержащая всю информацию о точках маршрута.
   * @param {object} container - DOM элемент, в который будут помещены все элементы, созданные в ходе работы.
   * @param {function} modeChangeHandler - колбэк, вызываемый при открытии формы редактирования
   * @param {function} waypointUpdateHandler - колбэк, вызываемый при изменении данных о точке маршрута.
   */
  constructor(waypointsModel, container, modeChangeHandler, waypointUpdateHandler) {
    this.#waypointsModel = waypointsModel;
    this.#container = container;
    this.#modeChangeHandler = modeChangeHandler;
    this.#waypointUpdateHandler = waypointUpdateHandler;
  }

  destroyWaypoint() {
    remove(this.#waypointComponent);
    remove(this.#waypointEditFormComponent);
  }

  resetView() {
    if(this.#waypointEditFormComponent) {
      this.#replaceEditFormToWaypoint();
    }
  }

  /**
   * Отрисовывает точку маршрута
   * @param {object} waypoint - объект с информацией о точке маршрута.
   */
  init(waypoint) {
    const prevWaypointComponent = this.#waypointComponent;
    const prevWaypointEditFormComponent = this.#waypointEditFormComponent;

    this.#waypoint = waypoint;
    this.#selectedDestination = getSelectedDestination(this.#waypointsModel.destinations, waypoint);
    this.#selectedOffers = getSelectedOffers(this.#waypointsModel.offers, waypoint);


    if (prevWaypointComponent === null || prevWaypointEditFormComponent === null) {
      this.#renderWaypointItem(this.#waypoint, this.#selectedDestination, this.#selectedOffers);
      return;
    }

    this.#waypointComponent = new WaypointItemView(waypoint, this.#selectedDestination, this.#selectedOffers);
    this.#waypointComponent.setListener('clickOnRollupBtn', this.#waypointRollupBtnClickHandler);

    if (prevWaypointEditFormComponent) {
      this.#replaceEditFormToWaypoint();
      remove(prevWaypointComponent);
      return;
    }

    replace(this.#waypointComponent, prevWaypointComponent);
    remove(prevWaypointComponent);
  }

  setSaving() {
    this.#waypointEditFormComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setDeleting() {
    this.#waypointEditFormComponent.updateElement({
      isDisabled: true,
      isDeleting: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#waypointEditFormComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#waypointEditFormComponent.shake(resetFormState);
  }

  #replaceWaypointToEditForm() {
    replace(this.#waypointEditFormComponent, this.#waypointComponent);
  }

  #replaceEditFormToWaypoint() {
    replace(this.#waypointComponent, this.#waypointEditFormComponent);
    this.#waypointEditFormComponent.removeListeners();
    remove(this.#waypointEditFormComponent);
    this.#waypointEditFormComponent = null;
    document.removeEventListener('keydown', this.#documentKeydownHandler);
  }

  #renderWaypointEditForm() {
    this.#waypointEditFormComponent = new EditWaypointFormView(this.#waypoint, this.#selectedDestination, this.#waypointsModel.destinations, this.#waypointsModel.offers);

    this.#waypointEditFormComponent.setListener('submit', this.#waypointEditFormSubmitHandler);
    this.#waypointEditFormComponent.setListener('clickOnRollupBtn', this.#waypointEditFormRollupBtnClickHandler);
    this.#waypointEditFormComponent.setListener('delete', this.#waypointEditFormDeleteHandler);

    document.addEventListener('keydown', this.#documentKeydownHandler);

    this.#replaceWaypointToEditForm();
  }

  /**
   *
   * @param {object} waypoint - объект с информацией о точке маршрута.
   * @param {object} selectedDestination - объект с информацией о выбранном месте назначения.
   * @param {array} selectedOffers - массив выбранных дополнительных предложений.
   */
  #renderWaypointItem(waypoint, selectedDestination, selectedOffers) {
    this.#waypointComponent = new WaypointItemView(waypoint, selectedDestination, selectedOffers);
    this.#waypointComponent.setListener('clickOnRollupBtn', this.#waypointRollupBtnClickHandler);

    render(this.#waypointComponent, this.#container);
  }

  // Обработчики

  #documentKeydownHandler = (evt) => {
    if (isEscape(evt.code)) {
      evt.preventDefault();
      this.#replaceEditFormToWaypoint();
    }
  };

  #waypointRollupBtnClickHandler = () => {
    this.#modeChangeHandler();
    this.#renderWaypointEditForm();
  };

  #waypointEditFormRollupBtnClickHandler = () => {
    this.#replaceEditFormToWaypoint();
  };

  /**
   * Обрабатывает отправку формы редактирования.
   * @param {object} updatedWaypoint - измененная точка маршрута.
   */
  #waypointEditFormSubmitHandler = (updatedWaypoint) => {
    const getUpdateTypeVersion = (update) => {
      if(this.#waypoint.basePrice !== update.basePrice || this.#waypoint.dateFrom !== update.dateFrom) {
        return UpdateType.MINOR;
      }

      return UpdateType.PATCH;
    };

    this.#waypointUpdateHandler(
      UserAction.UPDATE_WAYPOINT,
      getUpdateTypeVersion(updatedWaypoint),
      updatedWaypoint,
    );
  };

  /**
   * Обрабатывает нажатие на кнопку удаления точки маршрута.
   * @param {object} waypoint - объект с информацией о точке маршрута.
   */
  #waypointEditFormDeleteHandler = (waypoint) => {
    this.#waypointUpdateHandler(
      UserAction.DELETE_WAYPOINT,
      UpdateType.MINOR,
      waypoint,
    );
  };
}
