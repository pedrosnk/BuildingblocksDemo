var request = require('supertest');
var app = require('./app')

describe('Requests to Root Path', function(){

  it('returns 200 status code', function(done){
    request(app)
      .get('/')
      .expect(200)
      .end(function(err){
        if (err) { throw err; }
        done();
      });
  });



});

