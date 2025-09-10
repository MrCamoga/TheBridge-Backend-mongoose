const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendMail = require('../config/nodemailer');

const { UnauthorizedError, NotFoundError, ConflictError, InternalServerError } = require('../errors/httpErrors');

module.exports = {
	createUser: async (req,res,next) => {
		try {
			let { email, password } = req.body;
			if(password?.length < 8) password = null;
			password = password ? bcrypt.hashSync(password,10):null;
			const role = process.env.ADMIN_EMAIL == email ? 'admin':'user';
			const user = await User.create({...req.body, role, avatar: req.file?.filename, password, verified: false})
			const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
			const url = `${process.env.FRONT_URL}/verify/${token}`;
			// TODO send email
			try {
				sendMail(req.body.email,"Email verification",`Please click the following link to confirm your email: <br> <a href="${url}">Confirm email</a>`);
			} catch(error) {
				throw new InternalServerError('An error ocurred while sending the confirmation email');
			}
			res.status(201).send({message:'User registed sucessfully', data: user});
		} catch(error) {
			if(error.code == 11000) error = new ConflictError('Email or username already registered');
			next(error);
		}
	},
	getInfo: (req,res,next) => {
		res.status(200).send({message:'OK', data: req.user});
	},
	getUserInfo: async (req,res,next) => {
		try {
			let { username } = req.params;
			const user = username == "me" ? req.user : 
			await User.findOne({username})
			.select('screenname username createdAt avatar')
			.populate('posts');
			if(user) res.status(200).send({data: user});
			else if (username == "me") throw new UnauthorizedError("You must be logged in to access your profile");
			else throw new NotFoundError("User couldn't be found");
		} catch(error) {
			next(error);
		}
	}
};
