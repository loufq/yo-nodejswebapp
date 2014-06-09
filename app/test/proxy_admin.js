/**
 * 临时测试用
 */
var colors = require('colors');
var async = require('async');
var PModel = require('./../proxy/admin');
var db = require('./../config/db.js');

//Admin
var admins = [{
  name: 'loufq',
  login_name: 'loufq',
  pass: 'loufq',
  email: 'email',
  type: 1,
  desc: 'dev',
  status: 1
}];
var admin = admins[0];
async.waterfall([
  function(callback) {
    console.log('clean'.red);
    PModel.clean(function(err, result) {
      console.log('clean'.green);
      callback(err, result);
    });
  },
  function(arg1, callback) {
    console.log('create'.red);
    PModel.create(admin, function(err, result) {
      console.log('create'.green);
      console.log(result);
      callback(err, result);
    });
  },
  function(admin, callback) {
    console.log('update'.red);
    PModel.update(admin, function(err, result) {
      console.log('update'.green);
      console.log(result);
      callback(err, result);
    });
  },
  function(arg1, callback) {
    console.log('list'.red);
    PModel.list(0, 10, function(err, results) {
      console.log('list'.green);
      console.log(results);
      callback(err, results);
    })
  },
  function(arg1, callback) {
    console.log('detail'.red);
    PModel.getById(arg1[0]._id, function(err, result) {
      console.log('detail'.green);
      console.log(result);
      callback(err, result);
    })
  },
  function(arg1, callback) {
    console.log('deleteById'.red);
    PModel.deleteById(arg1._id, function(err, result) {
      console.log('deleteById'.green);
      console.log(result);
      callback(err, result);
    })
  }
], function(err, result) {
  console.log('Admin Model Proxy Method Test Done'.green);
  process.exit();
});

return;
async.series({
    new: function(callback) {
      callback('new')
    },
    update: function(callback) {
      callback('update')
    },
    detail: function(callback) {
      callback('detail')
    },
    list: function(callback) {
      callback('list')
    },
    del: function(callback) {
      callback('del')
    },
  },
  function(err, results) {
    async.each(admins, function(admin, callback) {

    }, function(err) {

    });
  });
