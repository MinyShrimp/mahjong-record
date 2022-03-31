
const express = require('express');
const morgan  = require('morgan');
const path    = require('path');

const app = express();
const port = 8002;

app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, '/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/build/index.html'))
});

app.listen(port, () => {});