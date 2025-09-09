const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');

const { NotFoundError } = require('../errors/httpErrors');

module.exports = {
	async createComment(req,res,next) {
		try {
			const post = await Post.findById(req.params.id);
			if(!post) throw new NotFoundError('Post cannot be found');
			const { text } = req.body;
			let comment = await Comment.create({text, userId: req.user._id, postId: post._id });
			post.comments.push(comment._id);
			await post.save();
			comment = await comment.populate('userId','screenname username avatar');
			res.status(201).send({message:'Comment posted successfully',data:comment});
		} catch(error) {
			next(error);
		}
	},

	async deleteComment(req,res,next) {
		try {
			const comment = await Comment.findByIdAndDelete(req.params.id);
			res.status(200).send({message: 'Comment deleted successfully', data: comment});
			const post = await Post.findByIdAndUpdate(comment.postId, {
				$pull: { comments: comment._id }
			})
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
			const comments = await Comment.find({postId: post._id })
				.skip((page-1)*limit)
				.limit(limit)
				.sort({createdAt: -1})
				.select('text likes')
				.populate('userId','first_name last_name');
			res.status(200).send({message:'OK',data:comments});
		} catch(error) {
			next(error);
		}
	},

	async likeComment(req,res,next) {
		try {
			const comment = await Comment.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } }, { new: true });
			if(!comment) throw new NotFoundError('Comment cannot be found');
			res.status(201).send({message:'Comment liked successfully'});
		} catch(error) {
			next(error);
		}
	},

	async unlikeComment(req,res,next) {
		try {
			const comment = await Comment.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } }, { new: true });
			if(!comment) throw new NotFoundError('Comment cannot be found');
			res.status(200).send({message:'Comment unliked successfully'});
		} catch(error) {
			next(error);
		}
	}

}
