import { useEffect, useState } from "react";
import { Route, Switch, useLocation, useHistory } from "react-router-dom"
import { api } from "../utils/Api";
import Header from './Header';
import Main from "./Main";
import Footer from './Footer';
import EditProfilePopup from "./EditProfilePopup";
import ImagePopup from "./ImagePopup";
import PopupWithConfirm from "./PopupWithConfirm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import {register, login, checkTokenValidity} from "../auth.js";
import InfoTooltip from "./InfoTooltip";

function App() {

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [currentCardId, setCurrentCardId] = useState();
  const location = useLocation();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const history = useHistory();

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
  };

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
  };

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
  };

  function handleDeleteClick(id) {
    setIsConfirmPopupOpen(true)
    setCurrentCardId({id: id})
    }

  function handleCardDelete() {
    const id = currentCardId.id;
    api.deleteCard(id)
      .then(() => {
        setCards((state) => state.filter((card) => card.id !== id));
        setIsConfirmPopupOpen(false);
      })
       .catch((err) => console.log(err))
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsConfirmPopupOpen(false);
    setSelectedCard({});
    setIsRegisterPopupOpen(false)
  }

  function handleOverlayClick(evt) {
    if (evt.target === evt.currentTarget) {
      closeAllPopups()
    }
  }

  function handleCardClick(link, name) {
    setSelectedCard({link: link, name: name})
  }

  function handleCardLike(likes, id) {
    const isLiked = likes.some(i => i === currentUser.id);
    api.changeLike(id, isLiked)
      .then((res) => {
        setCards((state) => state.map((card) => card.id === id ?
        {link: res.card.link, name: res.card.name, id: res.card._id, likes: res.card.likes, cardOwnerId: res.card.owner} :
        card))
      })
        .catch((err) => console.log(err))
}

  function handleUpdateUser(name, about) {
    api.editProfile(name, about)
      .then(res => {
        setCurrentUser({avatar: res.avatar, name: res.name, about: res.about, id: res._id});
        setIsEditProfilePopupOpen(false)
      })
        .catch(err => console.log(err))
  }

  function handleAvatarUpdate(avatarLink) {
    console.log(avatarLink)
    api.editAvatar(avatarLink)
      .then(res => {setCurrentUser({...currentUser, avatar: res.avatar,});
      setIsEditAvatarPopupOpen(false)
    })
        .catch(err => console.log(err));
  }

  function handleAddPlaceSubmit({name, link}) {
    api.postCard({name, link})
      .then((newCard => {
        setCards([{link: newCard.link, name: newCard.name, id: newCard._id, likes: newCard.likes, cardOwnerId: newCard.owner}, ...cards]);
        setIsAddPlacePopupOpen(false)
      }))
        .catch(err => console.log(err))
  }

  function handleRegistration({email, password}) {
    register({email, password})
      .then(data => {
        setIsRegistered(true);
        setIsRegisterPopupOpen(true);
        history.push("/sign-in")
      })
        .catch(err => {
          setIsRegistered(false);
          setIsRegisterPopupOpen(true);
          console.log(err);
        })
  }

  function handleLogin({email, password}) {
    login({email, password})
      .then(data => {
        setIsLoggedIn(true);
        localStorage.setItem("jwt", data.token);
        setUserEmail(email);
        history.push("/");
        })
        .catch(err => {
          setIsRegistered(false);
          setIsRegisterPopupOpen(true);
          console.log(err)
        })
  }

  function checkToken() {
    if (localStorage.getItem("jwt")) {
      const jwt = localStorage.getItem("jwt");
      checkTokenValidity(jwt)
        .then((res) => {
        if (res) {
          setUserEmail(res.email);
          setIsLoggedIn(true);
          history.push("/");
        }
      })
        .catch(err =>console.log(err))
    }
  }

  function handleUserSignOut() {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    history.push("/sign-in")
  }

  useEffect(()=>{
    checkToken();
    console.log('Типа токен чтоли?')
  }, [])

  useEffect(() => {
    const closeOnEsc = (e) => {
      if(e.key === 'Escape'){
        closeAllPopups()
      }
    }
    document.addEventListener('keydown', closeOnEsc)
    return () => document.removeEventListener('keydown', closeOnEsc)
  },[])

  useEffect(() => {
    if (isLoggedIn) {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([userInfo, cardsInfo]) => {
        const cardsFromServer = cardsInfo.map((card) => {
            return {
              link: card.link,
              name: card.name,
              id: card._id,
              likes: card.likes,
              cardOwnerId: card.owner
            }
          })
          setCards(cardsFromServer)
        ;
        setCurrentUser({avatar: userInfo.avatar, name: userInfo.name, about: userInfo.about, id: userInfo._id})
      })
        .catch(err => console.log(err))
    };
    console.log('запросы всего и вся?')
  }, [isLoggedIn])

  return (
  <>
    <Header email={userEmail} location={location} onSignOut={handleUserSignOut}/>

    <Switch>

     <CurrentUserContext.Provider value={currentUser}>

        <EditProfilePopup isOpen={isEditProfilePopupOpen}
                          onClose={closeAllPopups}
                          onUpdateUser={handleUpdateUser}/>

        <EditAvatarPopup isOpen={isEditAvatarPopupOpen}
                        onClose={closeAllPopups}
                        onUpdateAvatar={handleAvatarUpdate}/>

        <AddPlacePopup isOpen={isAddPlacePopupOpen}
                      onClose={closeAllPopups}
                      onAddPlace={handleAddPlaceSubmit}/>

        <ImagePopup cardAttributes={selectedCard}
                    onClose={closeAllPopups}
                    onOverlayClick={handleOverlayClick}/>

        <PopupWithConfirm isOpen={isConfirmPopupOpen}
                          onClose={closeAllPopups}
                          onDeleteClick={handleCardDelete}
                          onOverlayClick={handleOverlayClick}/>

        <Route path="/sign-in">
          <Login
          onLogin={handleLogin}/>
        </Route>

        <Route path="/sign-up">
          <Register
          onRegister={handleRegistration}/>
        </Route>

        <InfoTooltip isOpen={isRegisterPopupOpen}
                     isRegistered={isRegistered}
                     onClose={closeAllPopups}/>

        <ProtectedRoute
        exact path="/"
        loggedIn={isLoggedIn}
        component={Main}
        onEditAvatar={handleEditAvatarClick}
        onEditProfile={handleEditProfileClick}
        onAddPlace={handleAddPlaceClick}
        onCardClick={handleCardClick}
        onDeleteClick={handleDeleteClick}
        onCardLike={handleCardLike}
        cards={cards}/>

        {location.pathname === "/" && <Footer/>}
      </CurrentUserContext.Provider>

    </Switch>

  </>

  );
}

export default App;

