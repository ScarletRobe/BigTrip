import TripEventsPresenter from './presenter/trip-events-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import WaypointsModel from './model/waypoints-model.js';
import FilterModel from './model/filter-model.js';

// Элементы DOM

const filtersContainerElement = document.querySelector('.trip-controls__filters');
const tripEventsContainerElement = document.querySelector('.trip-events');

// Переменные

const waypointsModel = new WaypointsModel();
const filterModel = new FilterModel();
const tripEventsPresenter = new TripEventsPresenter(tripEventsContainerElement, waypointsModel, filterModel);
const filterPresenter = new FilterPresenter(waypointsModel, filterModel, filtersContainerElement);

//

filterPresenter.init();
tripEventsPresenter.init();

