const { readJSONFile, writeJSONFile } = require('../utils/fileUtils');
const { wss } = require('../app');
const questionsPath = './data/questions.json';

const addCommentToQuestion = (req, res) => {
  const questions = readJSONFile(questionsPath);
  const question = questions.find(q => q.id == req.params.id);
  if (question) {
    const newComment = { id: Date.now(), ...req.body };
    question.comments.push(newComment);
    writeJSONFile(questionsPath, questions);
    res.status(201).json(newComment);

    // Notify via WebSocket
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'new-comment', data: newComment }));
      }
    });
  } else {
    res.status(404).json({ message: 'Question not found' });
  }
};

const addCommentToAnswer = (req, res) => {
  const questions = readJSONFile(questionsPath);
  let found = false;
  let newComment;
  questions.forEach(question => {
    const answer = question.answers.find(a => a.id == req.params.id);
    if (answer) {
      newComment = { id: Date.now(), ...req.body };
      answer.comments.push(newComment);
      found = true;
    }
  });
  if (found) {
    writeJSONFile(questionsPath, questions);
    res.status(201).json(newComment);

    // Notify via WebSocket
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'new-comment', data: newComment }));
      }
    });
  } else {
    res.status(404).json({ message: 'Answer not found' });
  }
};

const editComment = (req, res) => {
  const questions = readJSONFile(questionsPath);
  let found = false;
  questions.forEach(question => {
    const indexQ = question.comments.findIndex(c => c.id == req.params.id);
    if (indexQ !== -1) {
      question.comments[indexQ] = { ...question.comments[indexQ], ...req.body };
      found = true;
    }
    question.answers.forEach(answer => {
      const indexA = answer.comments.findIndex(c => c.id == req.params.id);
      if (indexA !== -1) {
        answer.comments[indexA] = { ...answer.comments[indexA], ...req.body };
        found = true;
      }
    });
  });
  if (found) {
    writeJSONFile(questionsPath, questions);
    res.json(questions);
  } else {
    res.status(404).json({ message: 'Comment not found' });
  }
};

const deleteComment = (req, res) => {
  const questions = readJSONFile(questionsPath);
  let found = false;
  questions.forEach(question => {
    question.comments = question.comments.filter(c => c.id != req.params.id);
    question.answers.forEach(answer => {
      answer.comments = answer.comments.filter(c => c.id != req.params.id);
    });
    found = true;
  });
  if (found) {
    writeJSONFile(questionsPath, questions);
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'Comment not found' });
  }
};

module.exports = { addCommentToQuestion, addCommentToAnswer, editComment, deleteComment };
