const express = require('express');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.static(path.join(__dirname, 'dev')));

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
      fs.readFile('generator.html', 'utf8', (error, data) => {
        error ? res.send("oops: ", error) : res.send(data);
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


app.use((req, res) => {
    res.status(404).send('Page not found');
});