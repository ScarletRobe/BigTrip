import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class WaypointsApiService extends ApiService {
  getWaypoints() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  getDestinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  getOffers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  /**
   * Обновляет точку маршрута на сервере.
   * @param {object} waypoint - объект с информацией о точке маршрута.
   * @returns {Promise} распарсенный ответ.
   */
  async updateWaypoint(waypoint) {
    const response = await this._load({
      url: `points/${waypoint.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(waypoint)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  /**
   * Добалвяет точку маршрута на сервер.
   * @param {object} waypoint - объект с информацией о точке маршрута.
   * @returns {Promise} распарсенный ответ.
   */
  async addWaypoint(waypoint) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(waypoint)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  /**
   * Удаляет точку маршрута на сервере.
   * @param {object} waypoint - объект с информацией о точке маршрута.
   * @returns {Promise} распарсенный ответ.
   */
  async deleteWaypoint(waypoint) {
    const response = await this._load({
      url: `points/${waypoint.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  /**
   * Адаптирует объект точки маршрута для отправки на сервер.
   * @param {object} waypoint - объект с информацией о точке маршрута.
   * @returns {object} точка маршрута в формате, привычном для сервера.
   */
  #adaptToServer(waypoint) {
    const adaptedWaypoint = {
      ...waypoint,
      'base_price': waypoint.basePrice,
      'date_from': waypoint.dateFrom.toISOString(),
      'date_to': waypoint.dateTo.toISOString(),
      'is_favorite': waypoint.isFavorite,
    };

    delete adaptedWaypoint.basePrice;
    delete adaptedWaypoint.dateFrom;
    delete adaptedWaypoint.dateTo;
    delete adaptedWaypoint.isFavorite;

    return adaptedWaypoint;
  }
}
