const router = require('express').Router();

const Controller = require('../controllers/CommentController');
const { authenticate, canModify } = require('../middleware/authentication');

router.post('/:id/likes', authenticate, Controller.likeComment);
router.delete('/:id/likes', authenticate, Controller.unlikeComment);

// create comment route in POST /posts/{postId}/comments
router.delete('/:id', authenticate, canModify('Comment'), Controller.deleteComment);

module.exports = router;
