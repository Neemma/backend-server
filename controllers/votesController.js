const { readJSONFile, writeJSONFile } = require('../utils/fileUtils');
const questionsPath = './data/questions.json';

const voteQuestion = (req, res) => {
  const questions = readJSONFile(questionsPath);
  const question = questions.find(q => q.id == req.params.id);
  if (question) {
    question.votes = question.votes || 0;
    question.votes += req.body.vote === 'up' ? 1 : -1;
    writeJSONFile(questionsPath, questions);
    res.json(question);
  } else {
    res.status(404).json({ message: 'Question not found' });
  }
};

const voteAnswer = (req, res) => {
  const questions = readJSONFile(questionsPath);
  let found = false;
  questions.forEach(question => {
    const answer = question.answers.find(a => a.id == req.params.id);
    if (answer) {
      answer.votes = answer.votes || 0;
      answer.votes += req.body.vote === 'up' ? 1 : -1;
      found = true;
    }
  });
  if (found) {
    writeJSONFile(questionsPath, questions);
    res.json(questions);
  } else {
    res.status(404).json({ message: 'Answer not found' });
  }
};

module.exports = { voteQuestion, voteAnswer };
