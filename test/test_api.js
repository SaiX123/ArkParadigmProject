process.env.NODE_ENV = 'test';

var mocha = require('mocha')
var describe = mocha.describe
var it = mocha.it
var assert = require('chai').assert
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

describe('Books', () => {
/*
  * Test the /GET route
  */
  describe('/GET FirstName', () => {
      it('it should GET everything under FirstName', (done) => {
        chai.request('http://localhost:3000')
            .get('/FirstName')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
              done();
            });
      });
  });

});

