import { useState, useEffect } from 'react'
import PopupWithForm from "./PopupWithForm";

export default function AddPlacePopup({isOpen, onClose, onAddPlace}) {
  const [placeName, setPlaceName] = useState("");
  const [placeAddress, setPlaceAddress] = useState("")

  function handleSubmit(evt) {
    evt.preventDefault();
    onAddPlace({name: placeName,
                link: placeAddress})
  }

  function onPlaceNameChange(evt) {
    setPlaceName(evt.target.value)
  }

  function onPlaceAddressChange(evt) {
    setPlaceAddress(evt.target.value)
  }

  useEffect(() => {
    setPlaceName("");
    setPlaceAddress("")
  }, [isOpen])

  return (
    <PopupWithForm name="element-add" title="Новое место"  buttonName="Сохранить" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}>
      <input className="form__input" id="place-input" type="text" name="place_name" value={placeName} placeholder="Название" onChange={onPlaceNameChange} required minLength="2" maxLength="30"/>
      <span className="form__input-error place-input-error"></span>
      <input className="form__input" id="address-input" type="url" name="place_address" value={placeAddress} placeholder="Ссылка на картинку" onChange={onPlaceAddressChange} required/>
      <span className="form__input-error address-input-error"></span>
   </PopupWithForm>
  )
}
