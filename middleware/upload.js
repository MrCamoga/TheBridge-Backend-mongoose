const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
	destination: (req,file,cb) => {
		console.log(file)
		cb(null,'media/');
	},
	filename: (req,file,cb) => {
		const name = Date.now() + '-' + Math.floor(Math.random()*0x10000).toString(16) + path.extname(file.originalname);
		console.log(name, file)
		cb(null, name);
	}
});


const fileFilter = (req,file,cb) => {
	const allowedTypes = ['webp','png','jpeg','jpg','gif'];
	const ext = path.extname(file.originalname).slice(1).toLowerCase();
	if(allowedTypes.includes(ext))
		cb(null, true);
	else cb(new Error('Mimetype not allowed'));
};

const limits = {
	fileSize: 1<<19
};

module.exports = multer({
	storage,
	fileFilter,
	limits
});
