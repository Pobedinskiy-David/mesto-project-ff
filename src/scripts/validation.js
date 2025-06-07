//#region Validation config
export const validationConfig = {
	formSelector: '.popup__form',
	inputSelector: '.popup__input',
	submitButtonSelector: '.popup__button',
	inactiveButtonClass: 'popup__button_disabled',
	inputErrorClass: 'popup__input_type_error',
	errorClass: 'popup__error_visible',
};
//#endregion

//#region Public API
/**
 * Подключает live-валидацию на все формы, подходящие под селектор.
 * @param {object} cfg ― объект конфигурации; передавать не обязательно.
 */
export const enableValidation = (cfg = validationConfig) => document.querySelectorAll(cfg.formSelector).forEach((form) => setEventListeners(form, cfg));

/**
 * Сбрасывает ошибки валидации у конкретной формы.
 * @param {HTMLFormElement} form ― форма.
 * @param {object} cfg ― объект конфигурации; передавать не обязательно.
 */
export const clearValidation = (form, cfg = validationConfig) => {
	const inputs = [...form.querySelectorAll(cfg.inputSelector)];
	const submit = form.querySelector(cfg.submitButtonSelector);

	disableSubmit(submit, cfg.inactiveButtonClass);
	inputs.forEach((input) => hideError(form, input, cfg));
};
//#endregion

//#region Internal helpers
const setEventListeners = (form, cfg) => {
	const inputs = [...form.querySelectorAll(cfg.inputSelector)];
	const submit = form.querySelector(cfg.submitButtonSelector);

	toggleButton(inputs, submit, cfg.inactiveButtonClass);

	inputs.forEach((input) =>
		input.addEventListener('input', () => {
			validateInput(form, input, cfg);
			toggleButton(inputs, submit, cfg.inactiveButtonClass);
		})
	);
};

const validateInput = (form, input, cfg) => {
	if (input.validity.patternMismatch) {
		input.setCustomValidity(input.dataset.errorMessage);
	} else {
		input.setCustomValidity('');
	}

	if (!input.validity.valid) {
		showError(form, input, cfg);
	} else {
		hideError(form, input, cfg);
	}
};

const showError = (form, input, cfg) => {
	const errorEl = form.querySelector(`.${input.id}-error`);
	input.classList.add(cfg.inputErrorClass);
	errorEl.textContent = input.validationMessage;
	errorEl.classList.add(cfg.errorClass);
};

const hideError = (form, input, cfg) => {
	const errorEl = form.querySelector(`.${input.id}-error`);
	input.classList.remove(cfg.inputErrorClass);
	errorEl.textContent = '';
	errorEl.classList.remove(cfg.errorClass);
};

const hasInvalid = (inputs) => inputs.some((i) => !i.validity.valid);

const disableSubmit = (btn, inactiveClass) => {
	btn.disabled = true;
	btn.classList.add(inactiveClass);
};

const enableSubmit = (btn, inactiveClass) => {
	btn.disabled = false;
	btn.classList.remove(inactiveClass);
};

const toggleButton = (inputs, btn, inactiveClass) => (hasInvalid(inputs) ? disableSubmit(btn, inactiveClass) : enableSubmit(btn, inactiveClass));
//#endregion
