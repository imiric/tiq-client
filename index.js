
/**
 * Module dependencies.
 */
var _ = require('lodash'),
    Promise = require('bluebird'),
    request = require('superagent');

exports = module.exports = init;

/**
 * Module initialization function.
 *
 * @public
 */
function init(config) {
  return new TiqHttp(config);
}


/**
 * Main module object.
 *
 * @param {Object} config
 * @param {string} [config.host="localhost"] - The host to connect to.
 * @param {number} [config.port=8000] - The port to connect to.
 * @constructor
 * @private
 */
function TiqHttp(config) {
  var defaultConfig = {
      host: 'localhost',
      port: 8000
    },
    config = _.merge(defaultConfig, config || {});

  this.serverUrl = 'http://' + config.host + (config.port ? ':' + config.port : '');
  this.config = config;
  return this;
}


/**
 * Associate a collection of tokens with a collection of tags.
 *
 * @param {Array.<string>} tokens
 * @param {Array.<string>} tags
 * @param {string} [ns=''] - Namespace used for all tags and tokens.
 */
TiqHttp.prototype.associate = function(tokens, tags, ns) {
  if (!tokens.length || !tags.length) {
    return;
  }

  ns = ns || '';
  var tiq = this;

  // Promisify the POST request
  return new Promise(function(resolve, reject) {
    request
      .post(tiq.serverUrl + '/' + ns)
      .send({tokens: tokens, tags: tags})
      .end(function(res) {
        if (!res.ok || res.body.status != 'success') {
          reject(new Error(res.body.message));
        } else {
          resolve();
        }
      });
  });
}


/**
 * Get the tags associated with the given tokens.
 *
 * @param {Array.<string>} tokens
 * @param {string} [ns=''] - Namespace used for all tags and tokens.
 * @returns {Array.<string>} - Collection of associated tags.
 */
TiqHttp.prototype.describe = function(tokens, ns) {
  if (!tokens.length) {
    return;
  }

  ns = ns || '';
  var tiq = this;

  // Promisify the GET request
  return new Promise(function(resolve, reject) {
    request
      .get(tiq.serverUrl + '/' + ns)
      .query({tags: tokens})
      .end(function(res) {
        if (!res.ok || res.body.status != 'success') {
          reject(new Error(res.body.message));
        } else {
          resolve(res.body.data);
        }
      });
  });
}
