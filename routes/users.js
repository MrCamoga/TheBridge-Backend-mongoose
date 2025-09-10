const router = require('express').Router();

const { createUser, getInfo, getUserInfo } = require('../controllers/UserController');
const { authenticate } = require('../middleware/authentication');
const uploadImage = require('../middleware/upload');

router.post('/', uploadImage(multer => multer.single('avatar')), createUser);
router.get('/:username', getUserInfo);
router.get('/', authenticate, getInfo);

module.exports = router;
