const mongoose = require('mongoose');

module.exports = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log('Connected to the DB');
	} catch(error) {
		console.error(error);
		throw new Error('Error connecting to the DB');
	}
}
