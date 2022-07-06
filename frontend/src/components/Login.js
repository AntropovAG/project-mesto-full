import React, { useState } from 'react'

function Login({onLogin}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleEmailChange(evt) {
    setEmail(evt.target.value);
  }

  function handlePasswordChange(evt) {
    setPassword(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onLogin({email, password})
  }

  return (
    <form className="form" name="login" onSubmit={handleSubmit}>
      <h2 className="form__label form__label_type_authorize">Вход</h2>
      <input className="form__input form__input_type_authorize" id="email-input" type="email" name="email" placeholder='Email' value={email || ""} onChange={handleEmailChange} required/>
      <span className="form__input-error email-input-error"></span>
      <input className="form__input form__input_type_authorize" id="password-input" type="password" name="password" placeholder='Пароль' value={password || ""} onChange={handlePasswordChange} required minLength="2" maxLength="40"/>
      <span className="form__input-error password-input-error"></span>
      <button className="form__authorize-button" type="submit">Войти</button>
    </form>
  )
}

export default Login
