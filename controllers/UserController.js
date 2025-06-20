const User = require('../models/User');

const bcrypt = require('bcryptjs');

module.exports = {
	createUser: (req,res,next) => {
		let { email, password } = req.body;
		if(password.length < 6) password = null;
		password = password ? bcrypt.hashSync(password,10):null;
		const role = process.env.ADMIN_EMAIL == email ? 'admin':'user';
		User.create({...req.body, role, password}).then(user => {
			res.status(201).send({message:'User registed sucessfully', data: user});
		}).catch(error => {
			if(error.code == 11000) return res.status(409).send({message:'Email already registered'});
			console.log(error);
			next(error); //res.status(500).send({message:'Internal Server Error',error});
		});
	},
	getInfo: (req,res,next) => {
		res.status(200).send({message:'OK', data: req.user});
	}
};
