import dayjs from 'dayjs';

// Алгоритм взят с https://learn.javascript.ru/task/random-int-min-max
/**
 * Возвращает случайное число из диапазона.
 * Диапазон по умолчанию [0;1].
 * @param {number} min - минимальное число из диапазона.
 * @param {number} max - максимальное число из диапазона.
 * @returns {integer} - случайное число.
 */
const getRandomPositiveInteger = (min = 0, max = 1) => {
  if (max < 0 || min < 0 || max % 1 !== 0 || min % 1 !== 0) {
    throw new Error('Задан некорректный диапазон');
  }
  if (max < min) {
    [min, max] = [max, min];
  }
  return Math.abs(Math.round(min - 0.5 + Math.random() * (max - min + 1)));
};

/**
 * Генерирует ранее не использованные числа.
 * @param {number} min - минимальное число из диапазона.
 * @param {number} max - максимальное число из диапазона.
 * @returns {function} - функция генерирующая уникальное значение в зависимости от переданного окружения.
 */
const getUniqueRandomPositiveInteger = (min, max) => {
  if (max < 0 || min < 0 || max % 1 !== 0 || min % 1 !== 0) {
    throw new Error('Задан некорректный диапазон');
  }
  if (max < min) {
    [min, max] = [max, min];
  }
  const numbers = [];
  for (let i = min; i <= max; i++) {
    numbers.push(i);
  }

  return () => Number(numbers.splice(getRandomPositiveInteger(0, numbers.length - 1), 1));
};

/**
 * Переводит дату из формата UTC в удобный для пользователя.
 * @param {Date} date - дата в формате UTC.
 * @param {string} format - формат, в котором нужно отобразить дату.
 * @returns {string} - дата в понятном формате.
 */
const humanizeDate = (date, format = 'D MMMM') => dayjs(date).format(format);

/**
 * Приводит формат даты к формтау dayjs.
 * @param {Date} date - дата в формате UTC.
 * @returns {object} - дата в формате dayjs
 */
const formatDate = (date) => dayjs(date);

/**
 *
 * @param {string} code - строка с названием клавиши
 * @returns {boolean}
 */
const isEscape = (code) => (code === 'Escape' || code === 'Esc');

/**
 * Меняет первую букву строки на заглавную.
 * @param {string} text - текст
 * @returns {string} измененная строка
 */
const capitalizeFirstLetter = (text) => text[0].toUpperCase() + text.slice(1);

/**
 * Ищет выбранное место назначения.
 * @param {array} destinations - массив мест назначений.
 * @param {object} waypoint - объект с информацией о точке маршрута.
 * @returns {object} объект с информацией о выбранном месте назначения.
 */
const getSelectedDestination = (destinations, waypoint) => destinations.find((dest) => dest.id === (waypoint.updatedDestination ?? waypoint.destination));

/**
 * Ищет информацию о выбранных дополнительных предложениях.
 * @param {array} offers - массив всех типов событий и дополнительных предложений.
 * @param {object} waypoint - объект с информацией о точке маршрута.
 * @returns {array} массив объектов.
 */
const getSelectedOffers = (offers, waypoint) => {
  const offersList = offers.find((offer) => offer.type === (waypoint.updatedType ?? waypoint.type));
  const selectedOffersIds = waypoint.updatedOffers ?? waypoint.offers;
  return offersList.offers.filter((offer) => [...selectedOffersIds].some((offerId) => offerId === offer.id));
};

export {
  getRandomPositiveInteger,
  getUniqueRandomPositiveInteger,
  humanizeDate,
  isEscape,
  capitalizeFirstLetter,
  getSelectedDestination,
  getSelectedOffers,
  formatDate,
};
