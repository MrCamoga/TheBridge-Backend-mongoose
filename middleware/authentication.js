const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { UnauthorizedError, ForbiddenError } = require('../errors/httpErrors');

module.exports = {
	canModify: model => async (req,res,next) => {
		try {
			const document = await require(`../models/${model}`).findById(req.params.id);
			if(req.user.role !== 'admin' && document.userId.toString() !== req.user._id.toString())
				throw new ForbiddenError('Access Forbidden');
			req.document = document;
			next();
		} catch(error) {
			next(error);
		}
	},

	authenticate: async (req,res,next) => {
		try {
			const token = req.headers.authorization;
			if(!token) {
				throw new UnauthorizedError('JWT missing');
			}
			const { _id, ts } = jwt.verify(token,process.env.JWT_SECRET);
			const user = await User.findOne({ _id, tokens: ts });
			if(!user) {
				throw new UnauthorizedError('Invalid JWT');
			}
			req.user = user;
			next();
		} catch(error) {
			next(error);
		}
	}
};
