var co = require('co');
var parse = require('co-body');
var thunkify = require('thunkify');

var PAdmin = require('../../proxy/admin.js');

var views = require('co-views');
var render = views('views',{ default: 'jade' });

function routes(app) {
  app.get('/admin/login', login);
  app.post('/admin/users', dologin);
}

var login = function * () {
  this.body = yield render('/admin/login', { title: '登录'});
};

var dologin = function * () {
  var body = yield parse(this, {  limit: '1kb'});

  if (!body.loginname)   return self.throw (400, 'loginname required');
  if (!body.pwd) return this.throw (400, 'pwd required');

  var loginId = body.loginname;
  var pwd = body.pwd;

  var login = thunkify(PAdmin.login);
  try {
     var obj =  yield login(loginId, pwd);

     //https://github.com/expressjs/cookies#cookiesset-name--value---options--
     this.cookies.set('cUserID', obj._id,{path: '/', httpOnly: true,maxAge: null,rewrite: true,signed: false});
     this.body = yield render('/admin/users', { title: '用户管理'});
  } catch (e) {
    console.log(e.message);
    this.response.redirect('/admin/login', { msg: e.message});
  } finally {}
};

module.exports = routes;
