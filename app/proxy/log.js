'use strict';
var Model = require('../models/log.js');
var cloner = require('../common/cloner.js');
var selectFields = ['_id', 'type', 'targetId', 'desc', 'create'];

var DAO = function() {};
//===Common===
DAO.prototype.clean = function(cb) {
  Model.remove({}, cb);
};
DAO.prototype.find = function(query, opt, cb) {
  Model.find(query, [], opt, cb);
};
DAO.prototype.removeById = function(id, cb) {
  var condition = {
    _id: id
  };
  Model.remove(condition).exec(cb);
};
DAO.prototype.deleteById = function(id, cb) {
  var condition = {
    _id: id
  };
  Model.findOne(condition).exec(function(err, doc) {
    doc.status = 0;
    doc.save(cb);
  });
};
exports.deleteByIds = function(ids, cb) {
  var condition = {
    '_id': {
      '$in': ids
    }
  };
  Model.find(condition).exec(function(err, docs) {
    async.map(docs,
      function(entity, cb1) {
        entity.status = 0;
        entity.save(cb1);
      },
      function(err, results) {
        cb(err, null);
      });
  });
};

//创建
exports.create = function(itemObj, cb) {
  var m = new Model();
  delete itemObj._id;
  cloner.copy(itemObj, m);
  m.save(cb);
};

//更新
exports.update = function(itemObj, cb) {
  Model.findOne({
    _id: itemObj._id
  }, function(err, m) {
    cloner.copy(itemObj, m);
    m.save(cb);
  });
};

//获取用户信息
DAO.prototype.getById = function(id, cb) {
  var condition = {
    _id: id,
    status: {
      '$ne': 0
    }
  };
  Model.findOne(condition).exec(function(err, doc) {
    cb(err, cloner.clone(doc, selectFields));
  });
};

//获取用户信息s
DAO.prototype.getByIds = function(ids, cb) {
  var condition = {
    _id: {
      '$in': ids
    },
    status: {
      '$ne': 0
    }
  };
  Model.find(condition).exec(function(err, doc) {
    cb(err, cloner.clone(doc, selectFields));
  });
};

DAO.prototype.pagerInfo = function(keyword, cb) {
  var condition = {};
  condition.status = {
    '$ne': 0
  };
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
DAO.prototype.list = function(keyword, pageIndex, pageSize, cb) {
  var condition = {};
  condition.status = {
    '$ne': 0
  };
  if (keyword.length) {
    condition.mobile = new RegExp('' + keyword, "i");
  }
  var fileds = selectFields.join(' ');
  var extInfo = {
    skip: pageIndex * pageSize,
    limit: pageSize,
    sort: {
      create: -1
    }
  };
  Model.find(condition, fileds, extInfo).exec(function(err, docs) {
    if (err) return cb(err, null);
    var retList = [];
    docs.forEach(function(doc) {
      retList.push(cloner.clone(doc, selectFields));
    });
    cb(null, retList);
  });
};

module.exports = new DAO();
