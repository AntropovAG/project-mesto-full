import { useContext } from 'react'
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card({link, name, likes, id, cardOwnerId, onCardClick, onDeleteClick, onCardLike}) {
  const currentUser = useContext(CurrentUserContext);
  const isOwn = cardOwnerId === currentUser.id;
  const isLiked = likes.some(i => i === currentUser.id);
  const cardLikeButtonClassName = (`element__like-button ${isLiked && 'element__like-button_active'}`);
  function handleClick() {
    onCardClick(link, name);
  }

  return (
    <article className="element">
      <img className="element__image" src={link} alt={name} onClick={handleClick}/>
      <div className="element__subscription">
        <h2 className="element__text">{name}</h2>
        <div className="element__like-group">
          <button className={cardLikeButtonClassName} type="button" onClick={() => onCardLike(likes, id)}></button>
          <span className="element__like-counter">{likes.length}</span>
        </div>
      </div>
      {isOwn && (
      <button className="element__delete-icon" onClick={() => onDeleteClick(id)}></button>)
      }
    </article>
  )
}

export default Card
