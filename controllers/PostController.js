const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');

const { BadRequestError, NotFoundError } = require('../errors/httpErrors');

module.exports = {
	getAllPosts(req,res,next) {
		const { page = 1, limit = 10 } = req.query;
		if(page < 1 || limit < 1) throw new BadRequestError('Invalid pagination parameters');
		Post.find().skip((page-1)*limit).limit(limit).sort({createdAt: -1}).populate('userId','first_name last_name').then(posts => {
			/*posts.forEach(post => {
				post.comments = Comment.find({where:{postId:post._id}});
			});*/
			res.status(200).send({message:'OK', posts});
		}).catch(next);
	},
	getPostByTitle(req,res,next) {
		Post.find({
			$title: {
				$search: req.params.title
			}
		}).then(posts => {
			res.status(200).send({message:'OK', posts});
		}).catch(next);
	},
	getPostById(req,res,next) {
		Post.findById(req.params.id).then(post => {
			if(post) res.status(200).send({message: 'OK', post});
			else res.status(404).send({message:'Post not found'});
		}).catch(next);
	},
	createPost(req,res,next) {
		Post.create({...req.body, userId: req.user._id, likes: []}).then(post => {
			res.status(201).send({message:'Post created successfully', post});
		}).catch(next);
	},
	updatePost(req,res,next) {
		const { title, text } = req.body;
		const post = req.document;
		console.log(post);
		if(title) post.title = title;
		if(text) post.text = text;
		post.save().then(post => {
			res.status(200).send({message:'Post updated successfully', data:post});
		}).catch(next);
	},
	deletePost(req,res,next) {
		Post.findByIdAndDelete(req.params.id).then(post => {
			res.status(200).send({message:'Post deleted', post});
		}).catch(next);
	},

	async createComment(req,res,next) {
		try {
			const post = await Post.findById(req.params.id);
			if(!post) throw new NotFoundError('Post cannot be found');
			const { text } = req.body;
			const comment = await Comment.create({text, userId: req.user._id, postId: post._id });
			res.status(201).send({message:'Comment posted successfully',data:comment});
		} catch(error) {
			next(error);
		}
	},

	async getPostComments(req,res,next) {
		try {
			const { page = 1, limit = 10 } = req.query;
			if(page < 1 || limit < 1) throw new BadRequestError('Invalid pagination parameters');

			const post = await Post.findById(req.params.id);
			if(!post) throw new NotFoundError('Post cannot be found');
			const comments = await Comment.find({postId: post._id }).skip((page-1)*limit).limit(limit).sort({createdAt: -1});
			res.status(200).send({message:'OK',data:comments});
		} catch(error) {
			next(error);
		}
	},

	async likePost(req,res,next) {
		try {
			const post = await Post.findById(req.params.id);
			if(!post) throw new NotFoundError('Post cannot be found');
			if(!post.likes.includes(req.user._id)) {
				post.likes.push(req.user._id);
				await post.save();
			}
			res.status(201).send({message:'Post liked successfully'});
		} catch(error) {
			next(error);
		}
	},

	async unlikePost(req,res,next) {
		try {
			const post = await Post.findById(req.params.id);
			if(!post) throw new NotFoundError('Post cannot be found');
			let index = post.likes.indexOf(req.user._id);
			if(index > -1) {
				post.likes.splice(index,1);
				await post.save();
			}
			res.status(200).send({message:'Post unliked successfully'});
		} catch(error) {
			next(error);
		}
	}
}
