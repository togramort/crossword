const express = require('express');
const fs = require('fs');
const path = require('path');
var bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.static(path.join(__dirname, 'dev')));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

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
  res.setHeader('content-type', 'utf8', 'text/html');
  fs.readFile('generator.html', (error, data) => {
    error ? res.send("oops: ", error) : res.send(data);
  });
});

app.get('/crossword', (req, res) => {
  res.setHeader('content-type', 'text/html');
  fs.readFile('crossword.html', 'utf8', (error, data) => {
    error ? res.send("oops: ", error) : res.send(data);
  });
});

app.get('/superdupercheck', (req, res) => {
  res.setHeader('content-type', 'application/json');
  fs.readFile('login.json', (error, data) => {
    error ? res.send("oops: ", error) : res.send(data);
  });
});

app.post('/uploadcross', (req, res) => {
  res.setHeader('content-type', 'application/json');
  fs.writeFile('crossword.json', JSON.stringify(req.body), (error) => {
    error ? res.send("oops: ", error) : res.send("cool");
  });
});

app.post('/uploadclues', (req, res) => {
  res.setHeader('content-type', 'application/json');
  fs.writeFile('clues.json', JSON.stringify(req.body), (error) => {
    error ? res.send("oops: ", error) : res.send("cool");
  });
});

app.get('/getthisgrid', (req, res) => {
  res.setHeader('content-type', 'application/json');
  fs.readFile('crossword.json', (error, data) => {
    error ? res.send("oops: ", error) : res.send(data);
  });
});

app.get('/getthisclues', (req, res) => {
  res.setHeader('content-type', 'application/json');
  fs.readFile('clues.json', (error, data) => {
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


app.use((req, res) => {
  res.status(404).send('Page not found');
});