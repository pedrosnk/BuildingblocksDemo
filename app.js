var express = require('express');

var app = express();

app.use(express.static('public'));

app.use('/cities', require(__dirname + '/routes/cities'));

module.exports = app;
