const getDestinationEventPhotosInner = (destination) => destination.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('\n');

export const getDestinationEventPhotos = (destination) => (
  `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${getDestinationEventPhotosInner(destination)}
    </div>
  </div>`
);
