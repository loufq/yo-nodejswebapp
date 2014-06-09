'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var table_name = 'Admin';

var schema = new Schema({
  name: {
    type: String
  },
  login_name: {
    type: String,
    index: {
      unique: true
    }
  },
  pass: {
    type: String
  },
  email: {
    type: String,
    unique: true
  },
  type: {
    type: Number
  },
  desc: {
    type: String
  },
  status: {
    type: Number
  },
  create: {
    type: Date,
    default: Date.now
  }
}, {
  _id: true
});

module.exports = mongoose.model(table_name, schema);
module.exports.getObjId = function(idString) {
  var id = mongoose.Types.ObjectId(idString);
  return id;
}
