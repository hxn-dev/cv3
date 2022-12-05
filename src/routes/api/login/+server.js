import { KEY } from '$env/static/private';
import AES from 'crypto-js/aes';
import Odoo from 'odoo-await';

export const POST = async ({ request }) => {
	const { username, password } = await request.json();

	let odoo = new Odoo({
		baseUrl: 'https://chift.odoo.com',
		db: 'chift',
		username,
		password
	});

	const connection = await makeConnect(odoo);
	if (isError(connection))
		return new Response(JSON.stringify({ success: false, connection }), { status: 500 });

	const result = await makeSearchRead(
		odoo,
		[],
		['id', 'avatar_128', 'name', 'email', 'street', 'zip', 'country_id']
	);

	if (isError(result))
		return new Response(JSON.stringify({ success: false, error: result }), { status: 500 });

	const token = encryptWithAES(odoo.password, KEY);
	return new Response(
		JSON.stringify({ success: true, username: odoo.username, token, data: result }),
		{ status: 200 }
	);
};

const makeConnect = async (odoo) => {
	try {
		return await odoo.connect();
	} catch (error) {
		return error;
	}
};

const makeSearchRead = async (odoo, domain, fields) => {
	try {
		return await odoo.searchRead(`res.partner`, domain, fields);
	} catch (error) {
		return error;
	}
};

const isError = (val) => {
	return (
		!!val &&
		typeof val === 'object' &&
		(Object.prototype.toString.call(val) === '[object Error]' ||
			(typeof val.message === 'string' && typeof val.name === 'string'))
	);
};

const encryptWithAES = (text, passphrase) => {
	return AES.encrypt(text, passphrase).toString();
};
