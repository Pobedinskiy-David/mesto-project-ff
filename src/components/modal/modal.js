//#region Popup helpers
const ESC_KEY = 'Escape';

/**
 * Открывает попап и добавляет обработчик Esc-закрытия.
 * @param {HTMLElement} popup ― DOM-элемент .popup
 */
export const handleOpenModal = (popup) => {
	popup.classList.add('popup_is-opened');
	window.addEventListener('keydown', onEscPress);
};

/**
 * Закрывает попап (если открыт) и убирает обработчик Esc-закрытия.
 * @param {HTMLElement} popup ― DOM-элемент .popup
 */
export const handleCloseModal = (popup) => {
	if (!popup.classList.contains('popup_is-opened')) return;
	popup.classList.remove('popup_is-opened');
	window.removeEventListener('keydown', onEscPress);
};

/**
 * Закрытие по клику на overlay (сам .popup).
 * Используется как обработчик mousedown.
 * @param {MouseEvent} evt
 * @param {HTMLElement} popup ― DOM-элемент .popup
 */
export const handleClickOutsideClose = (evt, popup) => {
	if (evt.target.classList.contains('popup')) handleCloseModal(popup);
};

/**
 * Обработчик Esc-закрытия (вешается на window).
 * @param {KeyboardEvent} evt
 */
const onEscPress = (evt) => {
	if (evt.key !== ESC_KEY) return;
	const opened = document.querySelector('.popup_is-opened');
	if (opened) handleCloseModal(opened);
};
//#endregion
