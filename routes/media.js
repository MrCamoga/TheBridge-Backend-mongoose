const router = require('express').Router();

const Controller = require('../controllers/MediaController');

router.get('/:id', Controller.getPostImage);
router.get('/avatar/:id', Controller.getUserImage);

module.exports = router;
