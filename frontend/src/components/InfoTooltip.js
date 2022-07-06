import React from 'react'
import confirm from '../images/Confirm_image.png'
import reject from '../images/Reject_image.png'

function InfoTooltip({isOpen, onClose, isRegistered}) {
  function handleOverlayClick(evt) {
    if (evt.target === evt.currentTarget) {
      onClose()
    }
  }
  return (
    <section className={`popup ${isOpen && 'popup_opened'}`} onMouseDown={handleOverlayClick}>
      <figure className="popup__container">
        <img className="popup__image popup__image_type_tooltip" src={isRegistered ? confirm : reject} alt='Статус'/>
        <p className="popup__caption popup__caption_type_tooltip">{isRegistered ? 'Вы успешно зарегистрировались' : 'Что-то пошло не так! Попробуйте ещё раз.'}</p>
        <button className="popup__close-button" type="button" onClick={onClose}></button>
      </figure>
    </section>
  )
}

export default InfoTooltip
