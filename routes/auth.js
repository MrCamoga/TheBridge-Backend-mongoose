const router = require('express').Router();

const controller = require('../controllers/AuthController');

const { authenticate } = require('../middleware/authentication');

router.post('/login', controller.login);
router.delete('/logout', authenticate, controller.logout);

module.exports = router;
