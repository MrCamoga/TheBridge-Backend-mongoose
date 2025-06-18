const router = require('express').Router();

const UserController = require('../controllers/UserController');
const {authenticate} = require('../middleware/authentication');


router.post('/',UserController.createUser);
router.get('/', authenticate, UserController.getInfo);

module.exports = router;
