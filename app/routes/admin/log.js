var co = require('co');
var parse = require('co-body');
var thunkify = require('thunkify');

var PLog = require('../../proxy/log.js');

var views = require('co-views');
var render = views('views', {default: 'jade'});

var config = require('../../config/config.js');

function routes(app) {
  app.get('/admin/log', defaultPage);
  app.get('/admin/log/pagerinfo', pagerInfo);
  app.get('/admin/log/pagerlist', pagerlist);
}
var defaultPage = function * () {
  var html = yield render('/admin/log', {
    title: '日志'
  });
  this.body = html;
};
//分页信息
var pagerInfo = function * () {
  var keyword = this.request.query.keyword;
  if (!keyword) keyword = '';
  var pagerInfo = thunkify(PLog.pagerInfo);

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
  var cfun = thunkify(PLog.list);
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

module.exports = routes;
