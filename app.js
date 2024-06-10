const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const questionRoutes = require('./routes/questions');
const answerRoutes = require('./routes/answers');
const commentRoutes = require('./routes/comments');
const voteRoutes = require('./routes/votes');

app.use('/questions', questionRoutes);
app.use('/answers', answerRoutes);
app.use('/comments', commentRoutes);
app.use('/votes', voteRoutes);

const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
  });
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = { wss };
