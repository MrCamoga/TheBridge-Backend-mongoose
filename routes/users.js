const router = require('express').Router();

const { createUser, getInfo } = require('../controllers/UserController');
const { authenticate } = require('../middleware/authentication');

router.post('/', createUser);
router.get('/', authenticate, getInfo);

module.exports = router;
