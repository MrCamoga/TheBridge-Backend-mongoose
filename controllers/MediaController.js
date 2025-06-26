const Post = require('../models/Post');

const { NotFoundError } = require('../errors/httpErrors');

module.exports = {
	getImage(req,res,next) {
		Post.findById(req.params.id).then(post => {
			if(!post || !post.image) throw new NotFoundError('Image or post doesn\'t exist');
			res.download('media/'+post.image);
		}).catch(next);
	}
};
