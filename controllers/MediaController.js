const Post = require('../models/Post');
const User = require('../models/User');

const { NotFoundError } = require('../errors/httpErrors');

module.exports = {
	getPostImage(req,res,next) {
		Post.findById(req.params.id).then(post => {
			if(!post || !post.image) throw new NotFoundError('Image or post doesn\'t exist');
			res.download('media/'+post.image);
		}).catch(next);
	},
	getUserImage(req,res,next) {
		User.findById(req.params.id).then(user => {
			if(!user || !user.avatar) throw new NotFoundError('Image or post doesn\'t exist');
			res.download('media/'+user.avatar);
		}).catch(next);
	},
};
