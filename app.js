var express = require('express');
var bodyParser = require('body-parser');
var redis = require('redis');

var app = express();
var urlencoded = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'));

// REDIS Conection
var redis = require("redis");
if (process.env.REDISTOGO_URL) {
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  var redisClient = redis.createClient(rtg.port, rtg.hostname);
  redisClient.auth(rtg.auth.split(":")[1]);
} else {
  var redisClient = require("redis").createClient();
  redisClient.select((process.env.NODE_ENV || 'development').length);
}

app.get('/cities', function(req, res){
  redisClient.hkeys('cities', function(err, names){
    if (err) { throw err; }
    res.json(names);
  });
});

app.post('/cities', urlencoded, function(req, res){
  var newCity = req.body;
  redisClient.hset('cities', newCity.name, newCity.description, function(err){
    if (err) { throw err; }
    res.status(201).json(newCity.name);
  });
});

app.delete('/cities/:name', function(req, res){
  redisClient.hdel('cities', req.params.name, function(err){
    if (err){
      throw err;
    }
    res.sendStatus(204);
  });
});

module.exports = app;
