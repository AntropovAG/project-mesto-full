import React from "react";

function PopupWithForm({name, title, buttonName, isOpen, onClose, children, onSubmit}) {
  function handleOverlayClick(evt) {
    if (evt.target === evt.currentTarget) {
      onClose()
    }
  }

  return (
    <section className={`popup popup_type_${name} ${isOpen && 'popup_opened'}`} onMouseDown={handleOverlayClick}>
    <div className="popup__container">
      <form className="form" name={`${name}_delete`} onSubmit={onSubmit}>
        <h2 className="form__label form__label_type_delete">{title}</h2>
        {children}
        <button className="form__save-button" type="submit">{buttonName}</button>
        <button className="popup__close-button" type="button" onClick={onClose}></button>
      </form>
    </div>
   </section>
  )
}

export default PopupWithForm
