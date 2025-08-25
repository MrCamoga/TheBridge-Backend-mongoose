const User = require('../models/User');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { ConflictError } = require('../errors/httpErrors');

module.exports = {
	createUser: async (req,res,next) => {
		try {
			let { email, password } = req.body;
			if(password?.length < 6) password = null;
			password = password ? bcrypt.hashSync(password,10):null;
			const role = process.env.ADMIN_EMAIL == email ? 'admin':'user';
			const user = await User.create({...req.body, role, password})
			const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
			const url = `${process.env.DOMAIN}/auth/verify/${token}`;
			console.log(url);
			// TODO send email
						
			res.status(201).send({message:'User registed sucessfully', data: user});
		} catch(error) {
			if(error.code == 11000) error = new ConflictError('Email already registered');
			next(error);
		}
	},
	getInfo: (req,res,next) => {
		res.status(200).send({message:'OK', data: req.user});
	}
};
