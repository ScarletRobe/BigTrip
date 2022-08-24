import ListFilterView from './view/list-filter-view.js';

import TripEventsPresenter from './presenter/trip-events-presenter.js';

import WaypointsModel from './model/waypoints-model.js';

import { render } from './render.js';

// Элементы DOM

const filtersContainerElement = document.querySelector('.trip-controls__filters');
const tripEventsContainerElement = document.querySelector('.trip-events');

// Переменные

const tripEventsPresenter = new TripEventsPresenter;
const waypointsModel = new WaypointsModel;

//

render(new ListFilterView(), filtersContainerElement);
tripEventsPresenter.init(tripEventsContainerElement, waypointsModel);

