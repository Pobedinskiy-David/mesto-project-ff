//#region Configuration
const BASE_URL = 'https://nomoreparties.co/v1/cohort-mag-4';
const DEFAULT_HEADERS = {
	authorization: '2d34b32a-2ed8-4b58-aec3-c4c80b91fa92',
	'Content-Type': 'application/json',
};
//#endregion

//#region Core request helper
/**
 * Унифицированный обёртка над fetch.
 * @param {string} path путь до эндпоинта.
 * @param {Object} opts метод и/или JSON-данные.
 * @param {string} opts.method
 * @param {Object} opts.data
 * @returns {Promise<any>} разобранный JSON или null (204 No Content).
 */
const request = async (path, { method = 'GET', data } = {}) => {
	const res = await fetch(`${BASE_URL}${path}`, {
		method,
		headers: DEFAULT_HEADERS,
		body: data ? JSON.stringify(data) : undefined,
	});

	if (!res.ok) {
		const text = await res.text().catch(() => '');
		throw new Error(`API ${res.status}: ${text || res.statusText}`);
	}

	return res.status === 204 ? null : res.json();
};
//#endregion

//#region Public API
export const getCurrentUser = () => request('/users/me');

export const getCards = () => request('/cards');

export const getInitialInfo = () => Promise.all([getCurrentUser(), getCards()]);

export const editProfile = (name, about) => request('/users/me', { method: 'PATCH', data: { name, about } });

export const postCard = (name, link) => request('/cards', { method: 'POST', data: { name, link } });

export const addLike = (cardId) => request(`/cards/likes/${cardId}`, { method: 'PUT' });

export const deleteLike = (cardId) => request(`/cards/likes/${cardId}`, { method: 'DELETE' });

export const deleteCard = (cardId) => request(`/cards/${cardId}`, { method: 'DELETE' });

export const updateAvatar = (avatar) => request('/users/me/avatar', { method: 'PATCH', data: { avatar } });
//#endregion
