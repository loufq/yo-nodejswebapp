/**!
 * outes/web.js
 */

"use strict";

/**
 * Module dependencies.
 */

function routes(app) {
  app.get('/test', test);
}

var test = function *() {
  yield this.render('index', {
    body: 'test'
  });
  //this.body = 'test';
};


module.exports = routes;
