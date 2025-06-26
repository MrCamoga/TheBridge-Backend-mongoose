const router = require('express').Router();

const Controller = require('../controllers/MediaController');
const { authenticate, canModify } = require('../middleware/authentication');

router.get('/:id', Controller.getImage);

module.exports = router;
