//==============================================================
// Мок-API: эмулирует сервер для локальной разработки,
// оставляя остальной код без изменений.
//==============================================================

const clone = (v) => JSON.parse(JSON.stringify(v));

const currentUser = {
	_id: 'user-0',
	name: 'Жак-Ив Кусто',
	about: 'Исследователь океана',
	avatar: 'https://pictures.s3.yandex.net/frontend-developer/common/ava.jpg',
};

let cards = [
	{
		_id: 'card-0',
		name: 'Архыз',
		link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg',
		likes: [],
		owner: { _id: currentUser._id },
	},
	{
		_id: 'card-1',
		name: 'Челябинская область',
		link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg',
		likes: [],
		owner: { _id: currentUser._id },
	},
	{
		_id: 'card-2',
		name: 'Иваново',
		link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg',
		likes: [],
		owner: { _id: currentUser._id },
	},
	{
		_id: 'card-3',
		name: 'Камчатка',
		link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg',
		likes: [],
		owner: { _id: currentUser._id },
	},
	{
		_id: 'card-4',
		name: 'Холмогорский район',
		link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg',
		likes: [],
		owner: { _id: currentUser._id },
	},
	{
		_id: 'card-5',
		name: 'Байкал',
		link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg',
		likes: [],
		owner: { _id: currentUser._id },
	},
];

//#region User
export const getCurrentUser = () => {
	return clone(currentUser);
};

export const editProfile = (name, about) => {
	currentUser.name = name;
	currentUser.about = about;
	return clone(currentUser);
};

export const updateAvatar = (avatar) => {
	currentUser.avatar = avatar;
	return clone(currentUser);
};

//#endregion

//#region Cards
export const getCards = () => {
	return clone(cards).reverse();
};

let counter = 0;

export const postCard = (name, link) => {
	const card = {
		_id: `new-card-${counter++}`,
		name,
		link,
		likes: [],
		owner: { _id: currentUser._id },
	};
	cards = [card, ...cards];
	return clone(card);
};

export const addLike = (cardId) => {
	const card = cards.find((c) => c._id === cardId);
	if (!card) throw new Error('Card not found');
	if (!card.likes.includes(currentUser._id)) card.likes.push(currentUser._id);
	return clone(card);
};

export const deleteLike = (cardId) => {
	const card = cards.find((c) => c._id === cardId);
	if (!card) throw new Error('Card not found');
	card.likes = card.likes.filter((id) => id !== currentUser._id);
	return clone(card);
};

export const deleteCard = (cardId) => {
	const idx = cards.findIndex((c) => c._id === cardId);
	if (idx === -1) throw new Error('Card not found');
	const [removed] = cards.splice(idx, 1);
	return clone(removed);
};
//#endregion

export const getInitialInfo = () => [getCurrentUser(), getCards()];
