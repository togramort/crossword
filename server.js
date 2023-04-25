const http = require('http');
const fs = require('fs');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 8080;

const url = 'mongodb+srv://coolusername:greatpassword@crossword.vmrxejk.mongodb.net/?retryWrites=true&w=majority';

const server = http.createServer((req, res) => {
    console.log('server request');
    res.setHeader('content-type', 'text/html');
    fs.readFile('index.html', (error, data) => {
        error ? res.write("oops: ", error) : res.write(data);
        res.end();
    });
});

server.listen(PORT, (error) => {
    error ? console.log(error) : console.log(`listening port ${PORT}`);
});

mongoose
    .connect(url)
    .then((res) => console.log('connected to db'))
    .catch((error) => console.log(error)); 