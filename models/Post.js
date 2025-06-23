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
		likes: [{
			type: mongoose.Schema.ObjectId,
			ref: 'User'
		}]
	},
	{
		timestamps: true
	}
);

PostSchema.index({
	title: 'title'
});

module.exports = mongoose.model('Post', PostSchema);
