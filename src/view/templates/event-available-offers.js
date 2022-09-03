/**
 * Генерирует опции для формы выбора дополнительных предложений.
 * @param {string} selectedType - выбранный тип события.
 * @param {array} selectedOffers - массив id выбранных дополнительных предложений.
 * @param {array} offers - массив всех типов событий и дополнительных предложений.
 * @returns {string} строка с HTML кодом.
 */
export const getEventAvailableOffers = (selectedType, selectedOffers, offers) => {
  const offersByType = offers.find((offer) => offer.type === selectedType);

  return offersByType.offers.map((offer) => {
    const checked = selectedOffers.some((off) => offer.id === off.id) ? 'checked' : '';
    const offerTitlteWithoutSpaces = offer.title.replaceAll(' ', '-');
    return (
      `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerTitlteWithoutSpaces}-1" type="checkbox" name="event-offer-${offerTitlteWithoutSpaces}" ${checked}>
          <label class="event__offer-label" for="event-offer-${offerTitlteWithoutSpaces}-1">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
      </div>`
    );
  }).join('\n');
};
