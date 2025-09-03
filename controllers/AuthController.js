const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { UnauthorizedError, NotFoundError, BadRequestError } = require('../errors/httpErrors');

module.exports = {
	login: async (req,res,next) => {
		try {
			const { username, password } = req.body;
			if(!username || !password)
				throw new BadRequestError('Missing email or password');

			const user = await User.findOne({ $or: [{email: username},{username}]});
			const passwordsEqual = bcrypt.compareSync(password, user?.password ?? '$2a$10$j.NJYLehXvr/ehpgoTvQ0OO2N8as45Iv0JgZbSPf6lrpUmUAbFhfS');
			if(!user || !passwordsEqual)
				throw new NotFoundError('Wrong email or password');

			const ts = Date.now();
			const token = jwt.sign({_id: user._id, ts}, process.env.JWT_SECRET, {noTimestamp: true});
			if(user.tokens.length >= 5) user.tokens.shift();
			user.tokens.push(ts);
			await user.save();
			res.status(200).send({message:'Login successful', data: token});
		} catch(error) {
			next(error);
		}
	},
	logout: async (req,res,next) => {
		try {
			const { ts } = jwt.decode(req.headers.authorization, process.env.JWT_SECRET);
			await User.findByIdAndUpdate(req.user._id, {
				$pull: { tokens: ts }
			});
			res.status(200).send({message:'Logout successful'});
		} catch(error) {
			next(error);
		}
	},
	verify: async (req,res,next) => {
		try {
			try {
				var { _id } = jwt.verify(req.params.token, process.env.JWT_SECRET);
			} catch (error) {
				throw new UnauthorizedError('Verification token invalid');
			}
			await User.findByIdAndUpdate(_id, {
				verified: true
			});
			res.status(201).send({message:'Email verified'});
		} catch (error) {
			next(error);
		}
	}
};
