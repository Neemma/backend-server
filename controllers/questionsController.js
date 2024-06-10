const { readJSONFile, writeJSONFile } = require('../utils/fileUtils');
const { wss } = require('../app');
const questionsPath = './data/questions.json';

const addQuestion = (req, res) => {
  const questions = readJSONFile(questionsPath);
  const newQuestion = { id: Date.now(), ...req.body, answers: [], comments: [] };
  questions.push(newQuestion);
  writeJSONFile(questionsPath, questions);
  res.status(201).json(newQuestion);

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'new-question', data: newQuestion }));
    }
  });
};

const editQuestion = (req, res) => {
  const questions = readJSONFile(questionsPath);
  const index = questions.findIndex(q => q.id == req.params.id);
  if (index !== -1) {
    questions[index] = { ...questions[index], ...req.body };
    writeJSONFile(questionsPath, questions);
    res.json(questions[index]);
  } else {
    res.status(404).json({ message: 'Question not found' });
  }
};

const deleteQuestion = (req, res) => {
  let questions = readJSONFile(questionsPath);
  questions = questions.filter(q => q.id != req.params.id);
  writeJSONFile(questionsPath, questions);
  res.status(204).end();
};

const viewQuestion = (req, res) => {
  const questions = readJSONFile(questionsPath);
  const question = questions.find(q => q.id == req.params.id);
  if (question) {
    res.json(question);
  } else {
    res.status(404).json({ message: 'Question not found' });
  }
};

const listQuestions = (req, res) => {
  const questions = readJSONFile(questionsPath);
  res.json(questions);
};

const searchQuestions = (req, res) => {
  const questions = readJSONFile(questionsPath);
  const { keyword } = req.query;
  const lowerCaseKeyword = keyword.toLowerCase();

  const filteredQuestions = questions.filter(q => {
  
    const inQuestion = q.title.toLowerCase().includes(lowerCaseKeyword) ||
                       q.body.toLowerCase().includes(lowerCaseKeyword) ||
                       q.tags.some(tag => tag.toLowerCase().includes(lowerCaseKeyword));

    
    const inAnswers = q.answers.some(a => a.body.toLowerCase().includes(lowerCaseKeyword) ||
                                          a.comments.some(c => c.body.toLowerCase().includes(lowerCaseKeyword)));

    const inComments = q.comments.some(c => c.body.toLowerCase().includes(lowerCaseKeyword));

    return inQuestion || inAnswers || inComments;
  });

  if (filteredQuestions.length > 0) {
    res.json(filteredQuestions);
  } else {
    res.status(404).json({ message: 'No questions found matching the keyword' });
  }
};

module.exports = { addQuestion, editQuestion, deleteQuestion, viewQuestion, listQuestions, searchQuestions };
