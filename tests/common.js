const app = require('../');
const request = require('supertest');

module.exports = {
	async createUserAndLogin() {
		const user = {
			first_name: "Nombre",
			last_name: "Apellido",
			email: `${Math.floor(Math.random()*0x1000000)}@example.com`,
			password: "123456"
		}
		await request(app).post('/users').send(user);
		const res = await request(app).post('/auth/login').send(user);
		return res.body.data;
	},

	async createPost(token) {
		const post = {
			title: 'Title blalblalbla',
			text: 'qwe rtyuio p a sd f gh jk l ñ zxcv bn m'
		};
		const res = await request(app).post('/posts').set('Authorization',token).send(post);
		return res.body.data._id;
	},

	async createComment(token, postId) {
		const comment = {
			text: 'qwe rtyuio p a sd f gh jk l ñ zxcv bn m'
		};
		const res = await request(app).post(`/posts/${postId}/comments`).set('Authorization',token).send(comment);
		return res.body.data._id;
	}
}
