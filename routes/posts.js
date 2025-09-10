const router = require('express').Router();

const Controller = require('../controllers/PostController');
const CommentController = require('../controllers/CommentController');
const { authenticate, canModify } = require('../middleware/authentication');
const uploadImage = require('../middleware/upload');

router.get('/:id/comments', CommentController.getPostComments);
router.post('/:id/comments', authenticate, CommentController.createComment);
router.post('/:id/likes', authenticate, Controller.likePost);
router.delete('/:id/likes', authenticate, Controller.unlikePost);

router.get('/', Controller.getAllPosts);
router.get('/title/:title', Controller.getPostByTitle);
router.get('/:id', Controller.getPostById);
router.post('/', authenticate, uploadImage(multer => multer.single('image')), Controller.createPost);
router.put('/:id', authenticate, canModify('Post'), Controller.updatePost);
router.delete('/:id', authenticate, canModify('Post'), Controller.deletePost);

module.exports = router;
