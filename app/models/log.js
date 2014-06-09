'use strict';

var table_name = 'Log';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var schema = new Schema({
  type: {
    type: Number
  }, //1:login
  targetId: {
    type: String
  }, //type=1:userId
  desc: {
    type: String
  },
  create: {
    type: Date,
    default: Date.now
  } //创建时间
}, {
  _id: true
});
module.exports = mongoose.model(table_name, schema);
module.exports.getObjId = function(idString) {
  var id = mongoose.Types.ObjectId(idString);
  return id;
}
