//#region Imports
import './pages/index.css';
//#endregion

//#region Cards

const cardTemplate = document.querySelector('#card-template').content;

const cardsList = document.querySelector('.places__list');

function createCard({ name, link, likes, owner, _id }, currentUserId, removeCb, likeCb, openModalCb) {
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

function removeCard(card, cardId) {
	deleteCard(cardId)
		.then(() => {
			card.remove();
		})
		.catch((error) => {
			console.log(error);
		});
}

//#endregion

//#region App init
(async () => {
	try {
		const [user, cards] = await getInitialInfo();
		currentUserId = user._id;

		profileTitle.textContent = user.name;
		profileDescription.textContent = user.about;
		profileImage.style.backgroundImage = `url('${user.avatar}')`;

		cards.forEach((c) => appendCard(createCard(c, currentUserId, removeCard, likeCard, () => openImageModal(c.link, c.name))));
	} catch (err) {
		console.error(err);
	}
})();

enableValidation(validationConfig);
//#endregion
