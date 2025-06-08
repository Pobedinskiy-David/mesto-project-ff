const cardTemplate = document.querySelector('#card-template');
if (!cardTemplate) throw new Error('Template not found: #card-template');

const cardsList = document.querySelector('.places__list');
if (!cardsList) throw new Error('Container not found: .places__list');

function createCard({ name, link }) {
	const card = cardTemplate.content.querySelector('.places__item').cloneNode(true);
	const image = card.querySelector('.card__image');
	const title = card.querySelector('.card__title');
	const deleteButton = card.querySelector('.card__delete-button');

	image.src = link;
	image.alt = name;
	title.textContent = name;
	deleteButton.addEventListener('click', () => card.remove());

	return card;
}

function appendCard(card) {
	cardsList.append(card);
}

(async () => {
	try {
		initialCards.forEach((cardData) => appendCard(createCard(cardData)));
	} catch (err) {
		console.error(err);
	}
})();
