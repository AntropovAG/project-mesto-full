import { useContext } from "react";
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Main({onEditAvatar,
               onEditProfile,
               onAddPlace,
               onCardClick,
               onDeleteClick,
               onCardLike,
               cards}) {

  const currentUser = useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__avatar">
          <img className="profile__photo" src={currentUser.avatar} alt="Аватар пользователя"/>
          <button className="profile__photo-button" type="button" onClick={onEditAvatar}></button>
        </div>
        <div className="profile__info">
          <h1 className="profile__name">{currentUser.name}</h1>
          <button className="profile__edit-button" type="button" onClick={onEditProfile}></button>
          <p className="profile__occupation">{currentUser.about}</p>
        </div>
        <button className="profile__add-button" type="button" onClick={onAddPlace}></button>
      </section>

      <section className="elements">
      {
      cards.map((card) => (
          <Card {...card}
                key={card.id}
                onCardClick={onCardClick}
                onDeleteClick={onDeleteClick}
                onCardLike={onCardLike}/>
      ))
        }
      </section>

    </main>
  )
}

export default Main
