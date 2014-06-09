'use strict';
var Model = require('../models/admin.js');
var cloner = require('../common/cloner.js');

exports.Model = Model;

var selectFields = ['_id', 'name', 'login_name', 'email', 'type', 'create',
  'status'
];

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
//获取用户信息
DAO.prototype.getById = function(id, cb) {
  var condition = {
    _id: id
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
    }
  };
  Model.find(condition).exec(function(err, doc) {
    cb(err, cloner.clone(doc, selectFields));
  });
};
//创建
DAO.prototype.create = function(itemObj, cb) {
  var m = new Model();
  delete itemObj._id;
  cloner.copy(itemObj, m);
  m.save(cb);
};
//更新
DAO.prototype.update = function(itemObj, cb) {
  Model.findOne({
    _id: itemObj._id
  }, function(err, doc) {
    cloner.copy(itemObj, doc);
    doc.save(cb);
  });
};

//列表
DAO.prototype.list = function(pageIndex, pageSize, cb) {
  var skip = pageIndex * pageSize;
  var condition = {
    status: 1
  };
  var fileds = selectFields.join(' ');
  var extInfo = {
    skip: skip,
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

//===Common===
//登陆
DAO.prototype.login = function(loginname, pass, cb) {
  if (loginname.length === 0) return cb(new Error('loginname empty'), []);
  if (pass.length === 0) return cb(new Error('pass empty'), []);
  Model.findOne({
    login_name: loginname,
    pass: pass
  }, function(err, doc) {
    if (err) return cb(err);
    if (doc == null) return cb(new Error('密码错误'));
    cb(err, cloner.clone(doc, selectFields));
  });
};

//修改密码
DAO.prototype.changePass = function(login_id, oripass, pass, cb) {
  Model.findOne({
    _id: login_id,
    pass: oripass
  }, function(err, doc) {
    if (err) return cb(err);
    if (doc == null) return cb(new Error('原密码错误'));
    doc.pass = pass;
    doc.save(cb);
  });
};

module.exports = new DAO();
