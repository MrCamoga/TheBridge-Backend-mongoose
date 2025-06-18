const router = require('express').Router();

const controller = require('../controllers/AuthController');

router.post('/login', controller.login);
router.delete('/logout', controller.logout);

module.exports = router;
