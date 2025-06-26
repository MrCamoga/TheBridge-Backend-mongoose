const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
	{
		first_name: {
			type: String,
			required: [true,'First name cannot be empty']
		},
		last_name: {
			type: String,
			required: [true,'Last name cannot be empty']
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
		tokens: [],
	},
	{
		timestamps: true
	}
);

UserSchema.set('toJSON', {
	transform(doc, ret) {
		delete ret.password;
		return ret;
	}
});

module.exports = mongoose.model('User', UserSchema);
