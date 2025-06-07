//#region UI helpers
/**
 * Переключает состояние submit-кнопки.
 * @param {boolean} isLoading ― true, если идёт загрузка
 * @param {HTMLButtonElement} buttonEl ― кнопка
 * @param {{idle?:string,loading?:string}} [labels] ― подписи для состояний
 */
export const patchSubmitButtonLoadingState = (isLoading, buttonEl, { idle = 'Сохранить', loading = 'Сохранение...' } = {}) => {
	if (!buttonEl) return;
	buttonEl.disabled = isLoading;
	buttonEl.classList.toggle('popup__button_loading', isLoading);
	buttonEl.textContent = isLoading ? loading : idle;
};
//#endregion
