"use strict"
var http = require('http');
var app = require('koa')();
var favicon = require('koa-favicon');
var serve = require('koa-static');
var router = require('koa-router');
var config = require('./config/config.js');
var db = require('./config/db.js');

app.use(favicon(__dirname + '/public/images/favicon.ico'));

//使用静态文件
app.use(serve('./public'));
app.use(serve('./scripts'));
app.use(serve('./bower'));

// 使用路由
app.use(router(app));

//routes split file========================================start
var routes = require('./routes/index.js');
routes(app);
require('./routes/admin/login.js')(app);
require('./routes/admin/catalog.js')(app);
require('./routes/admin/log.js')(app);
require('./routes/api.js')(app);
//routes split file========================================end
// 开启服务器
http.createServer(app.callback()).listen(config.port);
//http.createServer(app.callback()).listen(3001);
console.info('Now ' + config.name + ' APP running on localhost:' + config.port);
