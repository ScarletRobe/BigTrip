import Observable from '../framework/observable.js';

import { UpdateType } from '../consts.js';
import dayjs from 'dayjs';

export default class WaypointsModel extends Observable {
  #waypointsApiService = null;

  #waypoints = [];
  #offers = [];
  #destinations = [];

  /**
   *
   * @param {object} waypointsApiService - объект класса WaypointsApiService.
   */
  constructor(waypointsApiService) {
    super();
    this.#waypointsApiService = waypointsApiService;
  }

  get waypoints () {
    return this.#waypoints;
  }

  get offers () {
    return this.#offers;
  }

  get destinations () {
    return this.#destinations;
  }

  /**
   * Обновляет точку маршрута.
   * @param {string} updateType - тип обновления.
   * @param {object} update - измененная точка маршрута.
   */
  async updateWaypoint(updateType, update) {
    const index = this.#waypoints.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting waypoint');
    }

    try {
      const response = await this.#waypointsApiService.updateWaypoint(update);
      const updatedWaypoint = this.#adaptToClient(response);
      this.#waypoints = [
        ...this.#waypoints.slice(0, index),
        updatedWaypoint,
        ...this.#waypoints.slice(index + 1),
      ];
      this._notify(updateType, updatedWaypoint);
    } catch(err) {
      throw new Error('Can\'t update waypoint');
    }
  }

  /**
   * Добавляет точку маршрута.
   * @param {string} updateType - тип обновления.
   * @param {object} update - новая точка маршрута.
   */
  async addWaypoint(updateType, update) {
    try {
      const response = await this.#waypointsApiService.addWaypoint(update);
      const newWaypoint = this.#adaptToClient(response);
      this.#waypoints = [
        newWaypoint,
        ...this.#waypoints
      ];
      this._notify(updateType, newWaypoint);
    } catch(err) {
      throw new Error('Can\'t add waypoint');
    }
  }

  /**
   * Удаляет точку маршрута.
   * @param {string} updateType - тип обновления.
   * @param {object} update - удаляемая точка маршрута.
   */
  async deleteWaypoint(updateType, update) {
    const index = this.#waypoints.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting waypoint');
    }

    try {
      await this.#waypointsApiService.deleteWaypoint(update);
      this.#waypoints = [
        ...this.#waypoints.slice(0, index),
        ...this.#waypoints.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete waypoint');
    }

    this._notify(updateType);
  }

  /**
   * Адаптирует объект точки маршрута для хранения на стороне клиента.
   * @param {object} waypoint - объект с информацией о точке маршрута.
   * @returns {object} точка маршрута в формате, привычном для стороны клиента.
   */
  #adaptToClient(waypoint) {
    const adaptedWaypoint = {
      ...waypoint,
      basePrice: waypoint.base_price,
      dateFrom: dayjs(waypoint.date_from),
      dateTo: dayjs(waypoint.date_to),
      isFavorite: waypoint.is_favorite,
    };

    delete adaptedWaypoint.base_price;
    delete adaptedWaypoint.date_from;
    delete adaptedWaypoint.date_to;
    delete adaptedWaypoint.is_favorite;

    return adaptedWaypoint;
  }

  async init() {
    try {
      const waypoints = await this.#waypointsApiService.getWaypoints();
      this.#destinations = await this.#waypointsApiService.getDestinations();
      this.#offers = await this.#waypointsApiService.getOffers();
      this.#waypoints = waypoints.map(this.#adaptToClient);
    } catch(err) {
      this.#waypoints = [];
      this.#destinations = null;
      this.#offers = null;

      this._notify(UpdateType.ERROR);
      return err;
    }

    this._notify(UpdateType.INIT);
  }
}
