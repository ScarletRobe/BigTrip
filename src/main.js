import TripEventsPresenter from './presenter/trip-events-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import WaypointsModel from './model/waypoints-model.js';
import FilterModel from './model/filter-model.js';

import AddEventBtnView from './view/add-event-btn-view.js';

import { render } from './framework/render.js';

// Элементы DOM

const filtersContainerElement = document.querySelector('.trip-controls__filters');
const tripEventsContainerElement = document.querySelector('.trip-events');
const addEventBtnContainer = document.querySelector('.trip-main');

// Переменные

const waypointsModel = new WaypointsModel();
const filterModel = new FilterModel();

const tripEventsPresenter = new TripEventsPresenter(tripEventsContainerElement, waypointsModel, filterModel);
const filterPresenter = new FilterPresenter(waypointsModel, filterModel, filtersContainerElement);

const addEventBtnComponent = new AddEventBtnView();

//

const newWaypointFormCancelHandler = () => {
  addEventBtnComponent.manageDisable(false);
};

const addEventBtnClickHandler = () => {
  tripEventsPresenter.createNewWaypointFormComponentView(newWaypointFormCancelHandler);
  addEventBtnComponent.manageDisable(true);
};

render(addEventBtnComponent, addEventBtnContainer);
addEventBtnComponent.setListener('click', addEventBtnClickHandler);

filterPresenter.init();
tripEventsPresenter.init();

