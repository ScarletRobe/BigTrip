import TripEventsPresenter from './presenter/trip-events-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import WaypointsModel from './model/waypoints-model.js';
import FilterModel from './model/filter-model.js';

import AddEventBtnView from './view/add-event-btn-view.js';

import { render } from './framework/render.js';
import WaypointsApiService from './waypoints-api-service.js';

// Элементы DOM

const filtersContainerElement = document.querySelector('.trip-controls__filters');
const tripEventsContainerElement = document.querySelector('.trip-events');
const addEventBtnContainer = document.querySelector('.trip-main');

// Переменные

const AUTHORIZATION = 'Basic scrltrb55';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const waypointsModel = new WaypointsModel(new WaypointsApiService(END_POINT, AUTHORIZATION));
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

filterPresenter.init();
tripEventsPresenter.init();
waypointsModel.init()
  .finally(() => {
    render(addEventBtnComponent, addEventBtnContainer);
    addEventBtnComponent.setListener('click', addEventBtnClickHandler);
  });

