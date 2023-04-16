const path = require('path');
const express = require('express'); //include
const app = express(); //create

app.use(express.static(path.resolve(__dirname, 'src')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'src', 'generator.html'));
});

app.listen(9999, () => {
    console.log('server on port 9999 :)');
});