var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var urlencoded = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'));

var cities = {
  'Lotopia': 'some description',
  'Caspiana': 'description',
  'Indigo': 'description'
};

app.get('/cities', function(req, res){
  res.json(Object.keys(cities));
});

app.post('/cities', urlencoded, function(req, res){
  var newCity = req.body;
  cities[newCity.name] = newCity.description;
  res.status(201).json(newCity.name);
});

module.exports = app;
