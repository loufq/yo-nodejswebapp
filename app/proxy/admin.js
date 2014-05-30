'use strict';
var Model = require('../models/admin.js');
var cloner = require('../common/cloner.js');

exports.Model = Model;

var selectFields = ['_id', 'name', 'login_name', 'email', 'type', 'create',
  'status'
];

exports.clean = function(callback) {
  Model.remove({}, cb);
};

exports.getByQuery = function(query, opt, cb) {
  Model.find(query, [], opt, cb);
};

exports.deleteById = function(id, cb) {
  Model.findOne({
    _id: id
  }, function(err, entity) {
    entity.status = 0;
    entity.save(cb);
  });
};

//登陆
exports.login = function(loginname, pass,cb) {
  //return function(cb){
    if (loginname.length === 0) return cb(new Error('loginname empty'), []);
    if (pass.length === 0) return cb(new Error('pass empty'), []);
    Model.findOne({
      login_name: loginname,
      pass: pass
    }, function(err, result) {
      if (err) return cb(err);
      if (result == null) return cb(new Error('密码错误'));
      cb(err, cloner.clone(result, selectFields));
    });
  //}
};

//修改密码
exports.changePass = function(login_id, oripass, pass, cb) {
  Model.findOne({
    _id: login_id,
    pass: oripass
  }, function(err, result) {
    if (err) return cb(err);
    if (result == null) return cb(new Error('原密码错误'));
    result.pass = pass;
    result.save(cb);
  });
};
//获取用户信息
exports.getById = function(id, cb) {
  Model.findOne({
    _id: id
  }, function(err, elem) {
    cb(err, cloner.clone(elem, selectFields));
  });
};
//获取用户信息s
exports.getByIds = function(ids, cb) {
  Model.find({
    '_id': {
      '$in': ids
    }
  }, function(err, elem) {
    cb(err, cloner.clone(elem, selectFields));
  });
};
//创建
exports.create = function(name, loginname, pass, email, cb) {
  var m = new Model();
  m.name = name;
  m.login_name = loginname;
  m.pass = pass;
  m.email = email;
  m.type = 1;
  m.status = 1;
  m.save(cb);
};
//更新
exports.update = function(id, name, loginname, pass, email, cb) {
  Model.findOne({
    _id: id
  }, function(err, entity) {
    entity.name = name;
    entity.login_name = loginname;
    entity.pass = pass;
    entity.email = email;
    entity.save(cb);
  });
};

//列表
exports.list = function(pageIndex, pageSize, cb) {
  var skip = pageIndex * pageSize;
  Model.find({
    status: 1
  }, selectFields.join(' '), {
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

//详细
exports.detail = function(id, cb) {
  Model.findOne({
    _id: id
  }, selectFields.join(' '), function(err, elem) {
    if (err) cb(err, null);
    cb(err, cloner.clone(elem, selectFields));
  });
};
