var co = require('co');
var parse = require('co-body');
var thunkify = require('thunkify');
var CModel = require('../proxy/catalog.js');
var ProductModel = require('../proxy/product.js');
var path = require('path');
var config = require('../config/config.js');

function routes(app) {
    app.get('/api/qrcode/:catalogId', scanQRCode);
    app.get('/api/code/:code', getByCode);
}

var getCatalogID = function(url) {
    console.log(url);
    var catalogId = /qrcode\/(.*)/gi.exec(url)[1];
    return catalogId;
}
var getCode123 = function(url) {
    var code = /code\/(.*)/gi.exec(url)[1];
    return code;
}

var getByCode = function * () {
    var getCode = getCode123(this.url);
    var catalogfun = thunkify(CModel.getByCode);
    try {
        var resultC = yield catalogfun(getCode);
        var cfun = thunkify(ProductModel.listAllWithCatalogId);
        var result = yield cfun(resultC._id);
        result.forEach(function(elem) {
            elem.imageurl = config.getImageUrl(elem._id + '.jpg');
        });
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
};

var scanQRCode = function * () {
    var catalogId = getCatalogID(this.url);

    var cfun = thunkify(ProductModel.listAllWithCatalogId);
    try {
        var result = yield cfun(catalogId);

        result.forEach(function(elem) {
            //elem.imageurl = path.join(config.upload_url, elem._id + '.jpg');
            elem.imageurl = config.getImageUrl(elem._id + '.jpg');
        });
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
};

module.exports = routes;
