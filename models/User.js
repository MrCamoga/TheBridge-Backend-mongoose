const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
	{
		screenname: {
			type: String,
			required: [true,'Screen name cannot be empty']
		},
		username: {
			type: String,
			unique: true,
			required: [true,'Username cannot be empty'],
			minlength: [4,'Username must be at least 4 characters long'],
			maxlength: [24,'Username must be at most 24 characters long'],
		},
		avatar: {
			type: String
		},
		email: {
			type: String,
			unique: true,
			required: [true,'Email cannot be empty']
		},
		password: {
			type: String,
			required: [true,'Password validation failed'],
		},
		role: {
			type: String,
			enum: ['user','admin']
		},
		verified: {
			type: Boolean,
			default: false
		},
		tokens: [],
	},
	{
		timestamps: true
	}
);

UserSchema.set('toJSON', {
	transform(doc, ret) {
		delete ret.password;
		delete ret.tokens;
		return ret;
	}
});

module.exports = mongoose.model('User', UserSchema);
