/**
 * Генерирует вспомогательные опции к инпуту ввода города.
 * @param {array} destinations - массив мест назначений.
 * @returns {string} строка с HTML кодом.
 */
export const getDestinationListOptions = (destinations) => destinations.map((destination) => (`<option value="${destination.name}"></option>`)).join('\n');
