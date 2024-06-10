const express = require('express');
const router = express.Router();
const votesController = require('../controllers/votesController');

router.post('/questions/:id', votesController.voteQuestion);
router.post('/answers/:id', votesController.voteAnswer);

module.exports = router;
