const { HttpError } = require('../errors/httpErrors');

const typeError = (err, req, res, next) => {
	if(err.name == 'ValidationError') {
		let errors = Object.values(err.errors).map(e => e.message);
		res.status(400).send({ message: errors.join(' || ') });
	} else if(err instanceof HttpError) {
		res.status(err.status).send({ message: err.message })
	} else {
		console.log(err)
		res.status(500).send({ message: 'Internal Server Error', err })
	}
}

module.exports = typeError;
