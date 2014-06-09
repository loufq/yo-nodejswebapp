/**
 * 临时测试用
 */
var colors = require('colors');
var async = require('async');
var PModel = require('./../proxy/catalog');
var db = require('./../config/db.js');

var catalogs = [{
  name: 'catalogName',
  code:'001',
  type: 1,
  status: 1,
  desc: 'catalogName desc',
}];
var catalog = catalogs[0];

async.waterfall([

  function(callback) {
    console.log('clean');
    PModel.clean(function(err, result) {
      callback(err, result);
    });
  },
  function(arg1, callback) {
    console.log('create');
    PModel.create(catalog, function(err, result) {
      console.log(result);
      callback(err, result);
    });
  },
  function(catalog, callback) {
    console.log('update');
    catalog.name = catalog.name + 'update';
    PModel.update(catalog, function(err, result) {
      console.log(result);
      callback(err, result);
    });
  },
  function(arg1, callback) {
    console.log('list');
    PModel.list('',0, 10, function(err, results) {
      console.log(results);
      callback(err, results);
    })
  },
  function(arg1, callback) {
    console.log('detail');
    PModel.getById(arg1[0]._id, function(err, result) {
      console.log(result);
      callback(err, result);
    })
  },
  function(arg1, callback) {
    console.log('deleteById');
    PModel.deleteById(arg1._id, function(err, result) {
      console.log(result);
      callback(err, result);
    })
  }
], function(err, result) {
  console.log('Catalog Model Proxy Method Test Done'.green);
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
