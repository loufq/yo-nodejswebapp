"use strict";
var co = require('co');
var parse = require('co-body');
var thunkify = require('thunkify');
var views = require('co-views');
var render = views('views',{ default: 'jade' });

function routes(app) {
  app.get('/', test);
}

var test = function * () {
  this.body = yield render('index', { title: 'halou,nodejs-koa'});
};

module.exports = routes;
