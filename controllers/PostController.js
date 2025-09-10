const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');

const { BadRequestError, NotFoundError, InternalServerError } = require('../errors/httpErrors');

const fs = require('fs');

module.exports = {
	getAllPosts(req,res,next) {
		const { page = 1, limit = 10 } = req.query;
		if(page < 1 || limit < 1) throw new BadRequestError('Invalid pagination parameters');
		Post.find()
		.skip((page-1)*limit)
		.limit(limit)
		.sort({createdAt: -1})
		.populate('userId','screenname username avatar')
		.populate({path: 'comments', select: 'text', populate: { path: 'userId', select: 'screenname username'}})
		.then(posts => {
			res.status(200).send({message:'OK', data: posts});
		}).catch(next);
	},
	getPostByTitle(req,res,next) {
		Post.find({
			$text: {
				$search: req.params.title
			}
		})
		.populate('userId','screenname username')
		.then(posts => {
			res.status(200).send({message:'OK', data: posts});
		}).catch(next);
	},
	getPostById(req,res,next) {
		Post.findById(req.params.id)
		.populate('userId','screenname username avatar')
		.populate({path:'comments', populate: {path:'userId', select: "screenname username avatar"}})
		.then(post => {
			if(post) res.status(200).send({message: 'OK', data: post});
			else res.status(404).send({message:'Post not found'});
		}).catch(next);
	},
	async createPost(req,res,next) {
		try {
			let post = await Post.create({...req.body, userId: req.user._id, likes: [], image: req.file?.filename });
			post = await post.populate('userId', 'screenname username avatar');
			req.user.posts.push(post._id);
			await req.user.save();
			res.status(201).send({message:'Post created successfully', data: post});
		} catch(error) {
			next(error);
		}
	},
	updatePost(req,res,next) {
		const { title, text } = req.body;
		const post = req.document;
		if(title) post.title = title;
		if(text) post.text = text;
		post.save().then(post => {
			res.status(200).send({message:'Post updated successfully', data:post});
		}).catch(next);
	},
	async deletePost(req,res,next) {
		try {
			const post = await Post.findByIdAndDelete(req.params.id);
			if(post.image)
				fs.unlink('media/'+post.image, (err) => {
					if(err) throw new InternalServerError('Error deleting media file');
				});
			req.user.posts.remove(post._id);
			await req.user.save();
			res.status(200).send({message:'Post deleted', data: post});
		} catch (error) {
			next(error);
		}
	},

	async likePost(req,res,next) {
		try {
			const post = await Post.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } });
			if(!post) throw new NotFoundError('Post cannot be found');
			res.status(201).send({message:'Post liked successfully'});
		} catch(error) {
			next(error);
		}
	},

	async unlikePost(req,res,next) {
		try {
			const post = await Post.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } });
			if(!post) throw new NotFoundError('Post cannot be found');
			res.status(200).send({message:'Post unliked successfully'});
		} catch(error) {
			next(error);
		}
	}
}
