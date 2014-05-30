var config = require('../../config/config.js');
var co = require('co');
var parse = require('co-body');
var thunkify = require('thunkify');
var views = require('co-views');
var render = views('views', {
default: 'jade'
});

var PModel = require('../../proxy/catalog.js');

function routes(app) {
  app.get('/admin/catalog', defaultIndex);
  app.get('/admin/catalog/pagerinfo', pagerInfo);
  app.get('/admin/catalog/pagerlist', pagerlist);
  app.get('/admin/catalog/detail', detail);
  app.post('/admin/catalog/update', update);
  app.post('/admin/catalog/del', del);
}

var defaultIndex = function * () {
  var html = yield render('/admin/catalog', {
    title: '分类管理'
  });
  this.body = html;
};

//分页信息
var pagerInfo = function * () {
  var keyword = this.request.query.keyword;
  if (!keyword) keyword = '';
  var pagerInfo = thunkify(PModel.pagerInfo);
  var onePageCount = config['list_one_page_count'];
  try {
    var obj = yield pagerInfo(keyword);
    this.body = {
      code: 0,
      msg: 0,
      result: {
        count: obj.count,
        pageCount: Math.ceil(obj.count * 1.0 / onePageCount),
        onePageItemCount: onePageCount
      }
    };
  } catch (e) {
    this.body = {
      code: 0,
      msg: ''
    };
  } finally {}
}
//pagerlist
var pagerlist = function * () {
  var keyword = this.request.query.keyword;
  if (!keyword) keyword = '';
  var pageIndex = this.request.query.pageIndex;
  var pageSize = this.request.query.pageSize;
  var onePageCount = config['list_one_page_count'];
  var cfun = thunkify(PModel.list);
  try {
    var result = yield cfun(keyword, pageIndex, pageSize);
    this.body = {
      code: 0,
      msg: '',
      result: result
    };
  } catch (e) {
    this.body = {
      code: 1,
      msg: e.message
    };
  } finally {}
}
//detail
var detail = function * () {
  var _id = this.request.query._id;
  var cfun = thunkify(PModel.getById);
  try {
    var result = yield cfun(_id);
    this.body = {
      code: 0,
      msg: '',
      result: result
    };
  } catch (variable) {
    this.body = {
      code: 1,
      msg: e.message
    };
  } finally {}
}
//update
var update = function * () {
  var body = yield parse(this, {
    limit: '1kb'
  });
  var _id = body._id;
  var name = body.name;
  var imgurl = body.imgurl;
  var type = parseInt(body.type) || 1;
  var status =parseInt(body.status) || 1;
  var desc = body.desc;
  var objItem = {
    _id:_id,name:name,imgurl:imgurl,type:type,status:status,desc:desc
  };
  if (!_id.length) { //update
    var cfun = thunkify(PModel.create);
    try {
      var result = yield cfun(objItem);
      this.body = {
        code: 0,
        msg: '',
        result: result
      };
    } catch (e) {
      this.body = {
        code: 1,
        msg: e.message
      };
    } finally {}
  } else { //new
    var cfun = thunkify(PModel.update);
    try {
      var result = yield cfun(objItem);
      this.body = {
        code: 0,
        msg: '',
        result: result
      };
    } catch (e) {
      this.body = {
        code: 1,
        msg: e.message
      };
    } finally {}
  }
}
//del
var del = function * () {
  var body = yield parse(this, {
    limit: '1kb'
  });
  var _id = body._id;
  var cfun = thunkify(PModel.deleteById);
  try {
    var result = yield cfun(_id);
    this.body = {
      code: 0,
      msg: ''
    };
  } catch (variable) {
    this.body = {
      code: 1,
      msg: e.message
    };
  } finally {}
}
module.exports = routes;
