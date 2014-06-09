
var mongoose = require('mongoose');

var selectFields = ['Admin', 'Catalog', 'Product', 'Log'];

selectFields.forEach(function(elem) {
  require('./'+ elem.toLowerCase());
  exports[elem] = mongoose.model(elem);
})

module.exports.getObjId = function(idString) {
  var id = mongoose.Types.ObjectId(idString);
  return id;
}
/*
require('./product');
exports.Product = mongoose.model('Product');
*/
