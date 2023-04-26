const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const loginHandler = require('./models/log');
require('dotenv').config();
const PORT = process.env.PORT || 8080;

export const NODE_URL = `http://localhost:${PORT}/`;

console.log(process.env);

const app = express();

app.use(express.static(path.join(__dirname, 'dev')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.setHeader('content-type', 'text/html');
  fs.readFile('index.html', (error, data) => {
    error ? res.send("oops: ", error) : res.send(data);
  });
});

app.get('/generator', (req, res) => {
  console.log("in get generator")
    res.setHeader('content-type', 'utf8', 'text/html');
    fs.readFile('generator.html', (error, data) => {
      if (error) {
        console.error(error);
        res.status(500).send('server error');
      } else {
        console.log("file read successfully");
        console.log(data)
        res.send(data);
      }
    });
});

app.get('/crossword', (req, res) => {
    res.setHeader('content-type', 'text/html');
    fs.readFile('crossword.html', 'utf8', (error, data) => {
      error ? res.send("oops: ", error) : res.send(data);
    });
});

app.get('/generator.html', function(req, res) {
  res.redirect('/generator');
});

app.get('/crossword.html', function(req, res) {
  res.redirect('/crossword');
});

app.get('/index.html', function(req, res) {
  res.redirect('/');
});

const db = 'mongodb+srv://coolusername:greatpassword@crossword.vmrxejk.mongodb.net/crossword?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('mongoDB connected');
  } catch (error) {
    console.error('mongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();

app.post('/', loginHandler.handleLogin);

app.use((req, res) => {
  res.status(404).send('Page not found');
});