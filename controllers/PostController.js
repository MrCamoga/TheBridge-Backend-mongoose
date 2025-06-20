const Post = require('../models/Post');

module.exports = {
	getAllPosts(req,res,next) {
		Post.find().then(posts => {
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
		Post.create({...req.body, userId: req.user._id}).then(post => {
			res.status(201).send({message:'Post created successfully', post});
		}).catch(next);
	},
	updatePost(req,res,next) {
		Post.findByIdAndUpdate(req.params.id, req.body, {new: true}).then(post => {
			res.status(200).send({message:'Post updated successfully', post});
		}).catch(next);
	},
	deletePost(req,res,next) {
		Post.findByIdAndDelete(req.params.id).then(post => {
			res.status(200).send({message:'Post deleted', post});
		}).catch(next);
	},
}
