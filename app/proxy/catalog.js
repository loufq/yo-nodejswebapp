'use strict';
var Model = require('../models/catalog.js');
var cloner = require('../common/cloner.js');

var selectFields = [
'_id', 'name', 'imgurl', 'type', 'status', 'desc','create'
];

exports.clean = function(cb) {
  Model.remove({}, cb);
};

exports.getByQuery = function(query, opt, cb) {
  Model.find(query, [], opt, callback);
};

exports.deleteById = function(id, cb) {
  Model.findOne({
    _id: id
  }, function(err, entity) {
    entity.status = 0;
    entity.save(cb);
  });
};

//创建
exports.create = function(itemObj, cb) {
  var m = new Model();
  m.name = itemObj.name;
  m.imgurl = itemObj.imgurl;
  m.type = itemObj.type;
  m.status = itemObj.status;
  m.desc = itemObj.desc;
  m.save(cb);
};

//更新
exports.update = function(itemObj, cb) {
  Model.findOne({
    _id: id
  }, function(err, m) {
    m.name = itemObj.name;
    m.imgurl = itemObj.imgurl;
    m.type = itemObj.type;
    m.status = itemObj.status;
    m.desc = itemObj.desc;
    m.save(cb);
  });
};

//获取用户信息
exports.getById = function(id, cb) {
  Model.findOne({
    _id: id,
    status: {
      '$ne': 0
    }
  }, function(err, elem) {
    cb(err, cloner.clone(elem, selectFields));
  });
};

//获取用户信息s
exports.getByIds = function(ids, cb) {
  Model.find({
    '_id': {
      '$in': ids
    },status: {
      '$ne': 0
    }
  }, function(err, elem) {
    cb(err, cloner.clone(elem, selectFields));
  });
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
  var condition = {};
  condition.status = {'$ne': 0};
  if (keyword.length) {
    condition.mobile = new RegExp('' + keyword, "i");
  }
  var skip = pageIndex * pageSize;
  Model.find(condition, selectFields.join(' '), {
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

exports.hasWithName = function(id,name, callback) {
  var condition = {};
  condition.name = name;
  condition.status = {
    '$ne': 0
  };
  if ( id && id.length>0) {
    condition._id = {
      '$ne': id
    };
  }
  Model.count(condition, function(err, count) {
    callback(err, count > 0 ? true : false);
  })
};
