import ListFilterView from './view/list-filter-view.js';

import TripEventsPresenter from './presenter/trip-events-presenter.js';

import WaypointsModel from './model/waypoints-model.js';

import { render } from './framework/render.js';
// Элементы DOM

const filtersContainerElement = document.querySelector('.trip-controls__filters');
const tripEventsContainerElement = document.querySelector('.trip-events');

// Переменные

const waypointsModel = new WaypointsModel;
const tripEventsPresenter = new TripEventsPresenter(tripEventsContainerElement, waypointsModel);

//

render(new ListFilterView(), filtersContainerElement);
tripEventsPresenter.init();

