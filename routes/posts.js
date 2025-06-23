const router = require('express').Router();

const Controller = require('../controllers/PostController');
const { authenticate, canModify } = require('../middleware/authentication');

router.get('/:id/comments', Controller.getPostComments);
router.post('/:id/comments', authenticate, Controller.createComment);
router.post('/:id/likes', authenticate, Controller.likePost);
router.delete('/:id/likes', authenticate, Controller.unlikePost);

router.get('/', Controller.getAllPosts);
router.get('/title/:title', Controller.getPostByTitle);
router.get('/:id', Controller.getPostById);
router.post('/', authenticate, Controller.createPost);
router.put('/:id', authenticate, canModify('Post'), Controller.updatePost);
router.delete('/:id', authenticate, canModify('Post'), Controller.deletePost);

module.exports = router;
