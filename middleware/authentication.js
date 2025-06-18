
const jwt = require('jsonwebtoken');
const { jwt_secret } = require('../config/');

const User = require('../models/User');

module.exports = {
	isAuthor: Model => async (req,res,next) => {
		try {
			const document = await Model.findById(req.params.id);
			if(document.userId.toString() !== req.user._id.toString())
				return res.status(403).send({message:'Access forbidden'});
			req.document = document;
			next();
		} catch(error) {
			console.log(error);
			res.status(500).send({message:'Internal Server Error',error});
			next(error);
		}
	},

	authenticate: async (req,res,next) => {
		try {
			const token = req.headers.authorization;
			if(!token) {
				return res.status(401).send({message:'Unauthorized - JWT token missing'});
			}
			const { _id, ts } = jwt.verify(token,jwt_secret);
			const user = await User.findOne({ _id, tokens: ts });
			if(!user) {
				return res.status(401).send({message:'Unauthorized - invalid token'});
			}
			req.user = user;
			next();
		} catch(error) {
			console.log(error);
			res.status(500).send({message:'Internal Server Error', error});
		}
	}
};
