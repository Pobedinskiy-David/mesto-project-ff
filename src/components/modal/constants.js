// Кэшированные списки узлов
export const $popups = document.querySelectorAll('.popup');
export const $popupEditProfile = document.querySelector('.popup_type_edit');
export const profileImagePopup = document.querySelector('.popup_type_avatar');
export const addCardPopup = document.querySelector('.popup_type_new-card');
export const cardImagePopup = document.querySelector('.popup_type_image');

// Элементы внутри всплывающего изображения
export const imagePopupImage = cardImagePopup.querySelector('.popup__image');
export const imagePopupImageCaption = cardImagePopup.querySelector('.popup__caption');
