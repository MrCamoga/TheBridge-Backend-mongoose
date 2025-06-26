const request = require('supertest');
const app = require('../');

const { createPost, createComment, createUserAndLogin } = require('./common');

describe('API Comment Tests', () => {
	const comment = {
		text: "blablablaliowa jiwoa jidwo jiwa",
	}

	let token;
	let postId;
	let commentId;
	let commentId2;

	beforeAll(async () => {
		token = await createUserAndLogin();
		const token2 = await createUserAndLogin();
		postId = await createPost(token);
		commentId = await createComment(token,postId);
		commentId2 = await createComment(token2,postId);
	});

	test('Create comment', async () => {
		await request(app).post(`/posts/${postId}/comments`).set('Authorization',token).send(comment).expect(201);
		await request(app).post(`/posts/000000000000000000000000/comments`).set('Authorization',token).send(comment).expect(404);
		await request(app).post(`/posts/${postId}/comments`).set('Authorization',token).send({}).expect(400);
		await request(app).post(`/posts/${postId}/comments`).send(comment).expect(401);
	});

	test('Delete comment', async () => {
		await request(app).delete(`/comments/${commentId}`).send().expect(401);
		await request(app).delete(`/comments/${commentId}`).set('Authorization',token).send().expect(200);
		await request(app).delete(`/comments/${commentId2}`).set('Authorization',token).send().expect(403);
	});

	test('Like comment', async () => {
		await request(app).post(`/comments/${commentId2}/likes`).set('Authorization',token).send().expect(201);
		await request(app).post(`/comments/000000000000000000000000/likes`).set('Authorization',token).send().expect(404);
		await request(app).post(`/comments/${commentId2}/likes`).send().expect(401);
	});

	test('Unlike comment', async () => {
		await request(app).delete(`/comments/${commentId2}/likes`).set('Authorization',token).send().expect(200);
		await request(app).delete(`/comments/000000000000000000000000/likes`).set('Authorization',token).send().expect(404);
		await request(app).delete(`/comments/${commentId2}/likes`).send().expect(401);
	});
});
