const { readJSONFile, writeJSONFile } = require('../utils/fileUtils');
const { wss } = require('../app');
const questionsPath = './data/questions.json';

const addAnswer = (req, res) => {
  const questions = readJSONFile(questionsPath);
  const question = questions.find(q => q.id == req.params.questionId);
  if (question) {
    const newAnswer = { id: Date.now(), ...req.body, comments: [] };
    question.answers.push(newAnswer);
    writeJSONFile(questionsPath, questions);
    res.status(201).json(newAnswer);

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'new-answer', data: newAnswer }));
      }
    });
  } else {
    res.status(404).json({ message: 'Question not found' });
  }
};

const editAnswer = (req, res) => {
  const questions = readJSONFile(questionsPath);
  let found = false;
  questions.forEach(question => {
    const index = question.answers.findIndex(a => a.id == req.params.id);
    if (index !== -1) {
      question.answers[index] = { ...question.answers[index], ...req.body };
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

const deleteAnswer = (req, res) => {
  const questions = readJSONFile(questionsPath);
  let found = false;
  questions.forEach(question => {
    question.answers = question.answers.filter(a => a.id != req.params.id);
    found = true;
  });
  if (found) {
    writeJSONFile(questionsPath, questions);
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'Answer not found' });
  }
};

const listAnswers = (req, res) => {
  const questions = readJSONFile(questionsPath);
  const question = questions.find(q => q.id == req.params.questionId);
  if (question) {
    res.json(question.answers);
  } else {
    res.status(404).json({ message: 'Question not found' });
  }
};

module.exports = { addAnswer, editAnswer, deleteAnswer, listAnswers };
