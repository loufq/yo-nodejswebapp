"use strict"
var http = require('http');

var app = require('koa')(),
    favicon = require('koa-favicon'),
    router = require('koa-router'),
    serve = require('koa-static'),
    views = require('koa-views');

var moment = require('moment');

// 使用./public下的静态文件
app.use(serve('./public'));
app.use(serve('./bower'));

app.use(favicon(__dirname + '/public/favicon.ico'));

//使用Jade作为模板引擎
app.use(views(__dirname+'/views', {
  default: 'jade'
}));

// 使用路由
app.use(router(app));
// x-response-time
app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  this.set('X-Powered-By', 'loufq');
  this.set('X-Response-Time', ms + 'ms');
});

// logger
app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});
/*
app.on('error', function(err, ctx){
  console.log('server error %s  %s', err, ctx);
});
*/
app.use(function *(){
  yield this.render('index', {
    user: 'John'
  });
});

// 开启服务器
http.createServer(app.callback()).listen(3000);
//http.createServer(app.callback()).listen(3001);
console.info('Now running on localhost:3000');
