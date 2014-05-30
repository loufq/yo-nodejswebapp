var co = require('co');
var parse = require('co-body');
var thunkify = require('thunkify');
var db = require('./config/db.js');
var PAdmin = require('./proxy/admin.js');

var admins = [{
  name: 'halou',
  login_name: 'admin',
  pass: 'admin123',
  email: '',
  type: 1,
  desc: 'dev',
  status: 1
}];
var admin = admins[0];
//创建
//name, loginname, pass, email, cb
PAdmin.clean(function(err,obj){
  PAdmin.create(admin.name, admin.login_name, admin.pass, admin.email, function(err, result) {
    PAdmin.list(0, 10, function(err, items) {
      console.log(items);
    });
  });
});
