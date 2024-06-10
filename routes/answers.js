const express = require('express');
const router = express.Router();
const answersController = require('../controllers/answersController');

router.post('/:questionId', answersController.addAnswer);
router.put('/:id', answersController.editAnswer);
router.delete('/:id', answersController.deleteAnswer);
router.get('/:questionId', answersController.listAnswers);

module.exports = router;
