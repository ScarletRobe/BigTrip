// Алгоритм взят с https://learn.javascript.ru/task/random-int-min-max
/**
 * Возвращает случайное число из диапазона.
 * Диапазон по умолчанию [0;1]
 * @param {number} min - минимальное число из диапазона
 * @param {number} max - максимальное число из диапазона
 * @returns {integer} - случайное число
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
 * Генерирует ранее не использованные числа
 * @param {number} min - минимальное число из диапазона
 * @param {number} max - максимальное число из диапазона
 * @returns {function} - функция генерирующая уникальное значение в зависимости от переданного окружения
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

export {
  getRandomPositiveInteger,
  getUniqueRandomPositiveInteger,
};
