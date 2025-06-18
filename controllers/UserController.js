const User = require('../models/User');

const bcrypt = require('bcryptjs');

module.exports = {
	createUser: (req,res,next) => {
		const password = bcrypt.hashSync(req.body.password,10);
		User.create({...req.body, role: 'user', password}).then(user => {
			res.status(201).send({message:'User registed sucessfully', data: user});
		}).catch(error => {
			console.log(error);
			res.status(500).send({message:'Internal Server Error',error});
		});
	},
	getInfo: (req,res,next) => {

	}
};
