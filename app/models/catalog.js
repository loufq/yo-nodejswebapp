'use strict';

var table_name = 'Catalog';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var schema = new Schema({
  name        : { type: String   , index: {unique: true}},
  imgurl      : { type: String },
  type        : { type: Number },//
  status      : { type: Number },//
  desc        : { type: String },//
  create      : { type: Date    , default: Date.now}//创建时间
},
{_id: true}
);
module.exports = mongoose.model(table_name, schema);
