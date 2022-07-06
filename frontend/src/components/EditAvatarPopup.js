import { useRef, useEffect } from 'react'
import PopupWithForm from "./PopupWithForm";

export default function EditAvatarPopup({isOpen, onClose, onUpdateAvatar}) {
  const avatarLink = useRef()

  function handleSubmit(evt) {
    evt.preventDefault();
    onUpdateAvatar({avatar: avatarLink.current.value})
  }

  useEffect(() => {
    avatarLink.current.value = ""
  }, [isOpen])

  return (
    <PopupWithForm name="change-photo" title="Обновить аватар"  buttonName="Сохранить" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}>
      <input className="form__input" id="photo-input" type="url" name="photo_link" placeholder="Ссылка на картинку" ref={avatarLink} required/>
      <span className="form__input-error photo-input-error"></span>
    </PopupWithForm>
  )
}
