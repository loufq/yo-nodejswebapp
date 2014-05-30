'use strict';
var Model = require('../models/log.js');
var cloner = require('../common/cloner.js');

exports.Model = Model;

var selectFields = ['_id', 'type', 'targetId', 'desc', 'create'];

exports.clean = function(callback) {
  Model.remove({}, cb);
};

exports.getByQuery = function(query, opt, cb) {
  Model.find(query, [], opt, cb);
};

//创建
exports.create = function(type, targetId, desc, cb) {
  var m = new Model();
  m.type = type;
  m.targetId = targetId;
  m.desc = desc;
  m.save(cb);
};
exports.pagerInfo = function(keyword, cb) {
    var condition = {};
    condition.status = {'$ne': 0};
    if (keyword.length) {
        condition.mobile = new RegExp('' + keyword, "i");
    }
    Model.count(condition, function(err, count) {
        cb(err, {
            count: count,
        });
    })
};
//列表
exports.list = function(keyword,pageIndex, pageSize, cb) {
  var skip = pageIndex * pageSize;
  Model.find({}, selectFields.join(' '), {
    skip: skip,
    limit: pageSize,
    sort: {
      create: -1
    }
  }).exec(function(err, results) {
    if (err) {
      return cb(err, null);
    };
    var retList = [];
    results.forEach(function(elem) {
      retList.push(cloner.clone(elem, selectFields));
    });
    cb(null, retList);
  });
};
