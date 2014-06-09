/**
 * 临时测试用
 */
var colors = require('colors');
var async = require('async');
var CModel = require('./../proxy/catalog');
var PModel = require('./../proxy/product');
var db = require('./../config/db.js');

var catalogs = [{
  name: 'catalogName',
  type: 1,
  status: 1,
  desc: 'catalogName desc',
}];

var products = [{
  name: 'product1',
  catalog: null,
  status: 1,
  desc: 'product1 desc',
},{
  name: 'product2',
  catalog: null,
  status: 1,
  desc: 'product2 desc',
}];

var catalog = catalogs[0];

async.waterfall([

  function(callback) {
    console.log('clean');
    CModel.clean(function(err, result) {
      PModel.clean(function(err, result) {
        console.log('cleanDone');
        callback(err, result);
      });
    });
  },
  function(arg1, callback) {
    console.log('create_catalog');
    CModel.create(catalog, function(err, result) {
      console.log('create_catalog_done');
      console.log('create_catalog_products');
      //创建商品
      async.each(products, function(product, cbP) {
        product.catalog =result._id;
        PModel.create(product,function(err,pccb){
          cbP(err,pccb)
        });
      }, function(err,results) {
        callback(err, catalog);
      });
    });
  },
  function(catalog, callback) {
    console.log('update============');
    callback(null, null);
  },
  function(arg1, callback) {
    console.log('list');
    PModel.list('', 0, 10, function(err, results) {
      console.log(results);
      callback(err, results);
    })
  }
], function(err, result) {
  console.log('Product Model Proxy Method Test Done'.green);
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
