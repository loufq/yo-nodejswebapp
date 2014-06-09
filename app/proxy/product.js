'use strict';
var async = require('async');
var _ = require('underscore')._;

var Model = require('../models/product.js');
var CModel = require('../models/catalog.js');

var cloner = require('../common/cloner.js');
//  name  catalog status desc create
var selectFields = [
    '_id', 'name', 'catalog', 'status', 'desc', 'create'
];

var cselectFields = [
    '_id', 'name', 'code', 'type', 'status', 'desc', 'create'
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
    Model.findOne(condition)
        .populate('Catalog', cselectFields.join(' '))
        .exec(function(err, elem) {
            cb(err, cloner.clone(elem, selectFields));
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

    Model.find(condition)
        .populate('Catalog', cselectFields.join(' '))
        .exec(function(err, elem) {
            cb(err, cloner.clone(elem, selectFields));
        });
};

DAO.prototype.pagerInfo = function(catalogId, cb) {
    var condition = {};
    condition.status = {
        '$ne': 0
    };
    condition.catalog = Model.getObjId(catalogId);

    Model.count(condition, function(err, count) {
        cb(err, {
            count: count,
        });
    })
};

//列表
DAO.prototype.list = function(catalogId, pageIndex, pageSize, cb) {
    var condition = {};
    condition.status = {
        '$ne': 0
    };
    condition.catalog = Model.getObjId(catalogId);

    var fileds = selectFields.join(' ');

    var extInfo = {
        skip: pageIndex * pageSize,
        limit: pageSize,
        sort: {
            create: -1
        }
    };

    Model.find(condition, fileds, extInfo)
        .populate('catalog', cselectFields.join(' '))
        .exec(function(err, results) {
            if (err) return cb(err, null);
            var retList = [];
            results.forEach(function(elem) {
                retList.push(cloner.clone(elem, selectFields));
            });
            cb(null, retList);
        });
};


DAO.prototype.listAllWithCatalogId = function(catalogId, cb) {
    var condition = {};
    condition.status = {
        '$ne': 0
    };
    condition.catalog = Model.getObjId(catalogId);
    Model.find(condition, selectFields.join(' '), {
        sort: {
            create: -1
        }
    }).populate('catalog', cselectFields.join(' '))
        .exec(function(err, results) {
            if (err) return cb(err, null);
            var retList = [];
            results.forEach(function(elem) {
                retList.push(cloner.clone(elem, selectFields));
            });
            cb(null, retList);
        });
};

DAO.prototype.hasWithName = function(id, name, callback) {
    var condition = {};
    condition.name = name;
    condition.status = {
        '$ne': 0
    };
    if (id && id.length > 0) {
        condition._id = {
            '$ne': id
        };
    }
    Model.count(condition, function(err, count) {
        callback(err, count > 0 ? true : false);
    })
};

module.exports = new DAO();
