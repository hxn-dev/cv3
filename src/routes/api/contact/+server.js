import { KEY } from '$env/static/private';
import Odoo from 'odoo-await';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';

export const POST = async ({ request }) => {
	const actions_list = ['create', 'edit', 'delete'];
	const { action, username, token, data } = await request.json();

	if (!actions_list.includes(action)) {
		return new Response(JSON.stringify({ success: false, error: 'Unauthorized action' }), {
			status: 500
		});
	}

	let odoo = new Odoo({
		baseUrl: 'https://chift.odoo.com',
		db: 'chift',
		username,
		password: decryptWithAES(token)
	});

	const connection = await makeConnect(odoo);
	if (isError(connection))
		return new Response(JSON.stringify({ success: false, connection }), { status: 500 });

	if (action == 'create') {
		const accountObj = {
			name: data.name || '',
			email: data.email || '',
			street: data.street || '',
			country_id: data.country == 0 ? null : data.country
		};
		const create = await makeCreate(odoo, accountObj);
		if (isError(create))
			return new Response(JSON.stringify({ success: false, error: create }), { status: 500 });

		return new Response(
			JSON.stringify({ success: true, new_account: { ...accountObj, id: create } }),
			{ status: 200 }
		);
	}

	if (action == 'delete') {
		const removed = await makeDelete(odoo, data.id);
		if (isError(removed))
			return new Response(JSON.stringify({ success: false, error: removed }), { status: 500 });

		return new Response(JSON.stringify({ success: true, removed_account_id: data.id }), {
			status: 200
		});
	}

	if (action == 'edit') {
		let accountObj = {
			name: data.name || '',
			email: data.email || '',
			street: data.street || '',
			country_id: data.country_id == 0 ? null : data.country_id
		};

		const updated = await makeUpdate(odoo, data.id, accountObj);
		if (isError(updated)) {
			return new Response(JSON.stringify({ success: false, error: updated }), { status: 500 });
		}

		return new Response(
			JSON.stringify({ success: true, edited_account: { ...accountObj, id: data.id } }),
			{ status: 200 }
		);
	}
};

const makeConnect = async (odoo) => {
	try {
		return await odoo.connect();
	} catch (error) {
		return error;
	}
};

const makeCreate = async (odoo, data) => {
	try {
		return await odoo.create('res.partner', data);
	} catch (error) {
		return error;
	}
};

const makeUpdate = async (odoo, id, data) => {
	try {
		await odoo.update('res.partner', id, data);
		return true;
	} catch (error) {
		return error;
	}
};

const makeDelete = async (odoo, id) => {
	try {
		await odoo.delete('res.partner', id);
		return true;
	} catch (error) {
		return error;
	}
};

const decryptWithAES = (ciphertext) => {
	const bytes = AES.decrypt(ciphertext, KEY);
	const originalText = bytes.toString(Utf8);
	return originalText;
};

const isError = (val) => {
	return (
		!!val &&
		typeof val === 'object' &&
		(Object.prototype.toString.call(val) === '[object Error]' ||
			(typeof val.message === 'string' && typeof val.name === 'string'))
	);
};
