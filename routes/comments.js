const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');

router.post('/questions/:id', commentsController.addCommentToQuestion);
router.post('/answers/:id', commentsController.addCommentToAnswer);
router.put('/:id', commentsController.editComment);
router.delete('/:id', commentsController.deleteComment);

module.exports = router;
