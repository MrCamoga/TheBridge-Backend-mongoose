const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: [true, 'Comment cannot be empty']
		},
		postId: {
			type: mongoose.Schema.ObjectId,
			ref: 'Post'
		},
		userId: {
			type: mongoose.Schema.ObjectId,
			ref: 'User'
		},
		likes: [{
			type: mongoose.Schema.ObjectId,
			ref: 'User'
		}]
	},
	{
		timestamps: true
	}
)

module.exports = mongoose.model('Comment', CommentSchema);
