const router = require('express').Router();

const Controller = require('../controllers/Controller');
const { authenticate, canModify } = require('../middleware/authentication');

router.get('/', Controller.getAllPosts);
router.get('/title/:title', Controller.getPostByTitle);
router.get('/:id', Controller.getPostById);
router.post('/', authenticate, canModify, Controller.createPost);
router.put('/', authenticate, canModify, Controller.updatePost);
router.delete('/', authenticate, canModify, Controller.deletePost);

module.exports = router;
