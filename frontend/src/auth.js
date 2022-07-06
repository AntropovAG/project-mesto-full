const baseURL = "http://localhost:3001";
const checkResponse = (res) => {return res.ok ? res.json() : Promise.reject(`Ошибка ${res.status}`)}

export function register(userEmail, password) {
  return fetch(`${baseURL}/signup`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userEmail, password)
  })
    .then(checkResponse);
}

export function login(userEmail, password) {
  return fetch(`${baseURL}/signin`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
    body: JSON.stringify(userEmail, password)
  })
    .then(checkResponse);
}

export function checkTokenValidity(token) {
  return fetch(`${baseURL}/users/me`, {
    method: 'GET',
    headers: {
    "Content-Type": "application/json",
  },
  credentials: 'include',
  })
    .then(checkResponse);
}
