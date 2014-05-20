
/**
 * Module dependencies.
 */
var should = require('chai').should(),
    nock = require('nock'),
    tiq = require('..')();

// Mock the HTTP responses
var scope =
  nock('http://localhost:8000')
    .post('/', {
      tokens: ['yup'],
      tags: ['nope'],
    })
    .reply(200, {
      status: 'success'
    })
    .post('/private', {
      tokens: ['hi'],
      tags: ['hello'],
    })
    .reply(200, {
      status: 'success'
    })
    .get('/?tags[0]=hi')
    .reply(200, {
      status: 'success',
      data: ['awesome', 'great']
    })
    .get('/private?tags[0]=hi&tags[1]=hello')
    .reply(200, {
      status: 'success',
      data: ['well', 'this', 'is', 'swell']
    });

describe('#associate()', function() {
  it('should not throw an error', function() {
    return tiq.associate(['yup'], ['nope']);
  })

  it('should not throw an error using namespaces', function() {
    return tiq.associate(['hi'], ['hello'], 'private');
  })
});

describe('#describe()', function() {
  it('should return the tags associated with the tokens', function() {
    return tiq.describe(['hi']).then(function(res) {
      res.should.deep.equal(['awesome', 'great']);
    });
  })

  it('should return the tags associated with the tokens using namespaces', function() {
    return tiq.describe(['hi', 'hello'], 'private').then(function(res) {
      res.should.deep.equal(['well', 'this', 'is', 'swell']);
    });
  })
});
