
var express = require('express');

var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({ extended: false });
var redis = require('redis');

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

var router = express.Router();

router.route('/')
  .get(function(req, res){
    redisClient.hkeys('cities', function(err, names){
      if (err) { throw err; }
      res.json(names);
    });
  })
  .post(urlencoded, function(req, res){
    var newCity = req.body;
    if(!newCity.name || !newCity.description){
      res.sendStatus(400);
      return false;
    }
    redisClient.hset('cities', newCity.name, newCity.description, function(err){
      if (err) { throw err; }
      res.status(201).json(newCity.name);
    });
  });

router.route('/:name')
  .get(function(req, res){
    var city = redisClient.hget('cities', req.params.name, function(err, description){
      res.render('show.ejs',
        { city: {name: req.params.name, description: description } });
    });
  })
  .delete(function(req, res){
    redisClient.hdel('cities', req.params.name, function(err){
      if (err){
        throw err;
      }
      res.sendStatus(204);
    });
  });

module.exports = router;
