const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Post title cannot be empty']
		},
		text: {
			type: String,
			required: [true, 'Post content cannot be empty']
		},
		userId: {
			type: mongoose.Schema.ObjectId,
			ref: 'User'
		},
		image: {
			type: String
		},
		likes: [{
			type: mongoose.Schema.ObjectId,
			ref: 'User'
		}],
		comments: [{
			type: mongoose.Schema.ObjectId,
			ref: 'Comment'
		}]
	},
	{
		timestamps: true
	}
);

PostSchema.index({
	title: 'text'
});

module.exports = mongoose.model('Post', PostSchema);
