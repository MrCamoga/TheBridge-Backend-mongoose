const Multer = require('multer');
const path = require('path');
const { BadRequestError } = require('../errors/httpErrors');

const storage = Multer.diskStorage({
	destination: (req,file,cb) => {
		console.log(file.fieldname)
		cb(null,'media/');
	},
	filename: (req,file,cb) => {
		const name = (req.user ? req.user._id + '-':'') + Date.now() + '-' + Math.floor(Math.random()*0x10000).toString(16) + path.extname(file.originalname);
		console.log(name, file)
		cb(null, name);
	}
});


const fileFilter = (req,file,cb) => {
	const allowedTypes = ['webp','png','jpeg','jpg','gif','jfif'];
	const ext = path.extname(file.originalname).slice(1).toLowerCase();
	if(allowedTypes.includes(ext))
		cb(null, true);
	else cb(new Error('Mimetype not allowed'));
};

const limits = {
	fileSize: 5000000
};

const multer = Multer({
	storage,
	fileFilter,
	limits
});

module.exports = (uploadType) => {
	const handler = uploadType(multer);
	return (req,res,next) => {
		handler(req,res, err => {
			if(err instanceof Multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
				return next(new BadRequestError("File too large. Max size is 5MB"));
			}
			return next(err);
		})
	}
}
