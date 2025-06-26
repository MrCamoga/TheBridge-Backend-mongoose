const request = require('supertest');
const app = require('../');

const { createUserAndLogin } = require('./common');

describe('API User Tests', () => {
	const user = {
		first_name: "Nombre",
		last_name: "Apellido",
		email: `${Math.floor(Math.random()*0x1000000)}@example.com`,
		password: "123456"
	}

	let token;

	beforeAll(async () => {
		token = await createUserAndLogin();
	});

	test('Create user', async () => {
		const {first_name, ...incompleteUser } = user;
		await request(app).post('/users').send(user).expect(201);
		await request(app).post('/users').send(user).expect(409);
		await request(app).post('/users').send(incompleteUser).expect(400);
	});

	test('Login', async () => {
		const login = { email: user.email, password: user.password };
		await request(app).post('/auth/login').send(login).expect(200);
		await request(app).post('/auth/login').send({ email: "a" }).expect(400);
		await request(app).post('/auth/login').send({ ...login, password: "123" }).expect(404);
	});

	test('Get user info', async () => {
		await request(app).get('/users').set('Authorization',token).expect(200);
		await request(app).get('/users').expect(401);
	});
});
