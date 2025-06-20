const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
	login: async (req,res,next) => {
		try {
			const { email, password } = req.body;
			if(!email || !password)
				return res.status(400).send({message:'Missing email or password'});

			const user = await User.findOne({email});
			const passwordsEqual = bcrypt.compareSync(password, user?.password ?? '$2a$10$j.NJYLehXvr/ehpgoTvQ0OO2N8as45Iv0JgZbSPf6lrpUmUAbFhfS');
			if(!user || !passwordsEqual)
				return res.status(404).send({message:'Wrong email or password'});

			const ts = Date.now();
			const token = jwt.sign({_id: user._id, ts}, process.env.JWT_SECRET, {noTimestamp: true});
			if(user.tokens.length >= 5) user.tokens.shift();
			user.tokens.push(ts);
			await user.save();
			res.status(200).send({message:'Login successful', data: token});
		} catch(error) {
			console.log(error);
			res.status(500).send({message:'Internal Server Error', error});
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
			console.log(error);
			res.status(500).send({message:'Internal Server Error'})
		}
	}
};
