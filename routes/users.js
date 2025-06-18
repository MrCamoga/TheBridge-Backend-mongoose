const router = require('express').Router();

const UserController = require('../controllers/UserController');

router.post('/',UserController.createUser);
router.get('/',UserController.getInfo); // TODO authentication

module.exports = router;
