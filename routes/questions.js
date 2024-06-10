const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/questionsController');

router.post('/', questionsController.addQuestion);
router.put('/:id', questionsController.editQuestion);
router.delete('/:id', questionsController.deleteQuestion);
router.get('/:id', questionsController.viewQuestion);
router.get('/', questionsController.listQuestions);
router.get('/search', questionsController.searchQuestions);

module.exports = router;
