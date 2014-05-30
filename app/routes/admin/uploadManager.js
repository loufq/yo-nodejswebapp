var co = require('co');
var parse = require('co-body');
var thunkify = require('thunkify');
var views = require('co-views');
var render = views('views',{ default: 'jade' });

var options = {
  tmpDir:  __dirname + '/../../public/uploaded/tmp',
  uploadDir: __dirname + '/../../public/uploaded/files',
  uploadUrl:  '/admin/uploaded/files/',
  storage : {
    type : 'local'
  }
};

var uploader = require('blueimp-file-upload-expressjs')(options);

function routes(app) {
  app.get('/admin/uploadManager', uploadIndex);
  app.get('/admin/upload', uploadGet);
  app.post('/admin/upload', uploadPost);
  app.delete('/admin/uploaded/files/:name', uploadDelete);
}

var uploadIndex = function * () {
  this.body = yield render('/admin/uploadManager', { title: 'UM'});
};

var uploadGet = function * () {
  var fun = thunkify(uploader.get);
  var obj = yield fun(this.req,this.res);
  this.body= obj;
};

var uploadPost = function * () {
  var fun = thunkify(uploader.post);
  try {
    var obj = yield fun(this.req,this.res);
    this.body= obj;
  } catch (err) {
    this.body=err;
  }
};

var uploadDelete = function * () {
  var fun = thunkify(uploader.delete);
  var obj = yield fun(this.req,this.res);
  this.body= obj;
};

module.exports = routes;
