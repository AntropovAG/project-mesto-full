import React from "react";

function ImagePopup({cardAttributes, onClose, onOverlayClick}) {

  return (
    <section className={`popup popup_background_dark popup_type_view-image ${cardAttributes.link && 'popup_opened'}`} onMouseDown={onOverlayClick}>
      <figure className="popup__container popup__container_size_wide">
        <img className="popup__image" src={cardAttributes.link} alt={cardAttributes.name}/>
        <p className="popup__caption">{cardAttributes.name}</p>
        <button className="popup__close-button" type="button" onClick={onClose}></button>
      </figure>
    </section>
  )
}

export default ImagePopup
