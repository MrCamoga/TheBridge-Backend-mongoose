const request = require('supertest');
const app = require('../');

const { createPost, createUserAndLogin } = require('./common');

describe('API Post Tests', () => {
	const post = {
		title: "Titulo",
		text: "blablablaliowa jiwoa jidwo jiwa",
	}

	let token;
	let postId;
	let postId2;

	beforeAll(async () => {
		token = await createUserAndLogin();
		const token2 = await createUserAndLogin();
		postId = await createPost(token);
		postId2 = await createPost(token2);
	});

	test('Create posts', async () => {
		const {title, ...incompletePost } = post;
		await request(app).post('/posts').set('Authorization',token).send(post).expect(201);
		await request(app).post('/posts').set('Authorization',token).send(incompletePost).expect(400);
		await request(app).post('/posts').send(post).expect(401);
	});

	test('Update post', async () => {
		await request(app).put(`/posts/${postId}`).set('Authorization',token).send({ title: 'eee' }).expect(200);
		await request(app).put(`/posts/${postId}`).send({ title: 'eee'}).expect(401);
		await request(app).put(`/posts/${postId2}`).set('Authorization',token).send({ title: 'eee'}).expect(403);
	});

	test('Delete post', async () => {
		await request(app).delete(`/posts/${postId}`).set('Authorization',token).send().expect(200);
		await request(app).delete(`/posts/${postId}`).send().expect(401);
		await request(app).delete(`/posts/${postId2}`).set('Authorization',token).send().expect(403);
	});

	test('Like post', async () => {
		await request(app).post(`/posts/${postId2}/likes`).set('Authorization',token).send().expect(201);
		await request(app).post(`/posts/000000000000000000000000/likes`).set('Authorization',token).send().expect(404);
		await request(app).post(`/posts/${postId2}/likes`).send().expect(401);
	});

	test('Unlike post', async () => {
		await request(app).delete(`/posts/${postId2}/likes`).set('Authorization',token).send().expect(200);
		await request(app).delete(`/posts/000000000000000000000000/likes`).set('Authorization',token).send().expect(404);
		await request(app).delete(`/posts/${postId2}/likes`).send().expect(401);
	})
});
