import React from 'react'

function PopupWithConfirm({isOpen, onClose, onDeleteClick, onOverlayClick}) {
  function handleSubmit(evt) {
    evt.preventDefault();
    onDeleteClick();
  }

  return (
    <section className={`popup popup_type_confirm ${isOpen && 'popup_opened'}`} onMouseDown={onOverlayClick}>
      <div className="popup__container">
        <form className="form" name="confirm_delete">
          <h2 className="form__label form__label_type_delete">Вы уверены?</h2>
          <button className="form__save-button" type="submit" onClick={handleSubmit}>Да</button>
          <button className="popup__close-button" type="button" onClick={onClose}></button>
        </form>
      </div>
    </section>
  )
}

export default PopupWithConfirm
