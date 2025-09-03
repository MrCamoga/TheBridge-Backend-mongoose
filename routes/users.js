const router = require('express').Router();

const { createUser, getInfo, getUserInfo } = require('../controllers/UserController');
const { authenticate } = require('../middleware/authentication');
const multer = require('../middleware/upload');

router.post('/', multer.single('avatar'), createUser);
router.get('/:username', getUserInfo);
router.get('/', authenticate, getInfo);

module.exports = router;
