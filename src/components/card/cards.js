import { deleteLike, addLike, deleteCard } from '../../scripts/api';

const cardTemplate = document.querySelector('#card-template').content;

export function createCard({ name, link, likes, owner, _id }, currentUserId, removeCb, likeCb, openModalCb) {
	const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
	const isLiked = likes.some(({ _id }) => _id === currentUserId);

	const cardImage = cardElement.querySelector('.card__image');
	const cardLikeButton = cardElement.querySelector('.card__like-button');
	const cardDeleteButton = cardElement.querySelector('.card__delete-button');
	const likesCountContainer = cardElement.querySelector('.card__like-count');

	likesCountContainer.textContent = likes.length;

	cardImage.src = link;
	cardImage.alt = name;
	cardImage.addEventListener('click', openModalCb);

	if (isLiked) {
		cardLikeButton.classList.add('card__like-button_is-active');
	}

	cardLikeButton.addEventListener('click', () => likeCb(cardLikeButton, likesCountContainer, _id));

	cardElement.querySelector('.card__title').textContent = name;

	if (owner._id !== currentUserId) {
		cardDeleteButton.remove();
	} else {
		cardDeleteButton.addEventListener('click', () => {
			removeCb(cardElement, _id);
		});
	}

	return cardElement;
}

export function likeCard(button, likeCounter, cardId) {
	const likeMethod = button.classList.contains('card__like-button_is-active') ? deleteLike : addLike;

	likeMethod(cardId)
		.then(({ likes }) => {
			button.classList.toggle('card__like-button_is-active');
			likeCounter.textContent = likes.length;
		})
		.catch((error) => {
			console.log(error);
		});
}

export function removeCard(card, cardId) {
	deleteCard(cardId)
		.then(() => {
			card.remove();
		})
		.catch((error) => {
			console.log(error);
		});
}
