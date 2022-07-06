import { useEffect, useState, useContext } from 'react'
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from '../contexts/CurrentUserContext';

export default function EditProfilePopup({isOpen, onClose, onUpdateUser}) {
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const currentUser = useContext(CurrentUserContext);

  function handleNameChange (evt) {
    setName(evt.target.value)
  }

  function handleDescriptionChange (evt) {
    setDescription(evt.target.value)
  }

  function handleSubmit (evt) {
    evt.preventDefault();
    onUpdateUser({
      name,
      about: description,
    })
  }

  useEffect(()=>{
    if (isOpen) {
      setName(currentUser.name);
      setDescription(currentUser.about)
    }
  }, [isOpen, currentUser])

  return (
    <PopupWithForm name="edit-profile" title="Редактировать профиль" buttonName="Сохранить" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}>
      <input className="form__input" id="username-input" type="text" name="user_name" value={name || ""} onChange={handleNameChange} required minLength="2" maxLength="40"/>
      <span className="form__input-error username-input-error"></span>
      <input className="form__input" id="occupation-input" type="text" name="user_occupation" value={description || ""} onChange={handleDescriptionChange} required minLength="2" maxLength="200"/>
      <span className="form__input-error occupation-input-error"></span>
    </PopupWithForm>
  )
}
