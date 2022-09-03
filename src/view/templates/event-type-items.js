/**
 * Генерирует опции для инпута выбора события.
 * @param {string} selectedType - выбранный тип события.
 * @param {array} offers - массив всех типов событий и дополнительных предложений.
 * @returns {string} строка с HTML кодом.
 */
export const getEventTypeItems = (selectedType, offers) => offers.map((offer) => {
  const checked = offer.type === selectedType ? 'checked' : '';

  return (
    `<div class="event__type-item">
      <input id="event-type-${offer.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type}" ${checked}>
      <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}-1">${offer.type}</label>
    </div>`
  );
}).join('\n');
