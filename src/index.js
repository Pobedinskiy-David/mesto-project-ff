//#region Imports
import './pages/index.css';

import { handleClickOutsideClose, handleCloseModal, handleOpenModal } from './components/modal/modal';
import { createCard, likeCard, removeCard } from './components/card/cards';
import {
	addCardPopup,
	cardImagePopup,
	imagePopupImageCaption,
	imagePopupImage,
	popupEditProfile,
	popups,
	profileImagePopup,
} from './components/modal/constants';
import { cardsList } from './components/card/constants';
import { editProfile, getInitialInfo, postCard, updateAvatar } from './scripts/api';
import { clearValidation, enableValidation, validationConfig } from './scripts/validation';
import { patchSubmitButtonLoadingState as toggleLoading } from './scripts/utils';
//#endregion

//#region State
let currentUserId = '';
//#endregion

//#region Popup common handlers
popups.forEach((popup) => {
	popup.addEventListener('mousedown', (e) => handleClickOutsideClose(e, popup));
	popup.querySelector('.popup__close').addEventListener('click', () => handleCloseModal(popup));
});
//#endregion

//#region Profile DOM nodes
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');
const profileAvatarBtn = document.querySelector('.profile__image-cover');
const profileEditBtn = document.querySelector('.profile__edit-button');
//#endregion

//#region Profile avatar form
const avatarForm = profileImagePopup.querySelector('.popup__form[name="edit-avatar"]');
const avatarInput = avatarForm.querySelector('.popup__input_type_url');

profileAvatarBtn.addEventListener('click', () => {
	avatarForm.reset();
	clearValidation(avatarForm, validationConfig);
	handleOpenModal(profileImagePopup);
});

avatarForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	const submitBtn = profileImagePopup.querySelector(validationConfig.submitButtonSelector);

	try {
		toggleLoading(true, submitBtn);
		const { avatar } = await updateAvatar(avatarInput.value);
		profileImage.style.backgroundImage = `url('${avatar}')`;
		handleCloseModal(profileImagePopup);
	} catch (err) {
		console.error(err);
	} finally {
		toggleLoading(false, submitBtn);
	}
});
//#endregion

//#region Profile main form
const profileForm = popupEditProfile.querySelector('.popup__form[name="edit-profile"]');
const nameInput = profileForm.querySelector('.popup__input_type_name');
const jobInput = profileForm.querySelector('.popup__input_type_description');

profileEditBtn.addEventListener('click', () => {
	clearValidation(profileForm, validationConfig);
	nameInput.value = profileTitle.textContent;
	jobInput.value = profileDescription.textContent;
	handleOpenModal(popupEditProfile);
});

profileForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	const submitBtn = popupEditProfile.querySelector(validationConfig.submitButtonSelector);

	try {
		toggleLoading(true, submitBtn);
		const { name, about } = await editProfile(nameInput.value, jobInput.value);
		profileTitle.textContent = name;
		profileDescription.textContent = about;
		handleCloseModal(popupEditProfile);
	} catch (err) {
		console.error(err);
	} finally {
		toggleLoading(false, submitBtn);
	}
});
//#endregion

//#region Card add form
const addCardBtn = document.querySelector('.profile__add-button');
const addCardForm = addCardPopup.querySelector('.popup__form');
const cardNameIn = addCardForm.querySelector('.popup__input_type_card-name');
const cardLinkIn = addCardForm.querySelector('.popup__input_type_url');

addCardBtn.addEventListener('click', () => {
	addCardForm.reset();
	clearValidation(addCardForm, validationConfig);
	handleOpenModal(addCardPopup);
});

addCardForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	const submitBtn = addCardPopup.querySelector(validationConfig.submitButtonSelector);

	try {
		toggleLoading(true, submitBtn);
		const cardData = await postCard(cardNameIn.value, cardLinkIn.value);
		prependCard(createCard(cardData, currentUserId, removeCard, likeCard, () => openImageModal(cardData.link, cardData.name)));
		handleCloseModal(addCardPopup);
	} catch (err) {
		console.error(err);
	} finally {
		toggleLoading(false, submitBtn);
	}
});
//#endregion

//#region Image preview
export const openImageModal = (link, alt) => {
	imagePopupImage.src = link;
	imagePopupImage.alt = alt;
	imagePopupImageCaption.textContent = alt;
	handleOpenModal(cardImagePopup);
};
//#endregion

//#region Card list helpers
export const prependCard = (card) => cardsList.prepend(card);
export const appendCard = (card) => cardsList.append(card);
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
