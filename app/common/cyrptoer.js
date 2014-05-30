'use strict';
//解密函数
//require cyrpto module
var crypto=require('crypto');
var key  = '61234567890123456123456789012345';
var iv = '6123456789012345';
var model = 'aes-256-cbc';

module.exports.de = function(data,cb){ 
  //key and iv should be same as the one in encrypt.php
  var decipher=crypto.createDecipheriv(model,key,iv);
  //since we have already added padding while encrypting, we will set autopadding of node js to false.
  decipher.setAutoPadding(false);
  // copy the output of encrypt.php and paste it below
  var cipherHexText256=data;//"tyZzOL3gHXkA1NIDoRYvpg==";
  var dec = decipher.update(cipherHexText256,'base64','utf8');
  //decrypted data is stored in dec
  dec += decipher.final('utf8');
  if (cb) {
    return  cb(null, dec);
  }
  return dec;
}

module.exports.en = function(data,cb){
  //key and iv should be same as the one in encrypt.php
  var cipher=crypto.createCipheriv(model,key,iv);

  //since we have already added padding while encrypting, we will set autopadding of node js to false.
  //cipher.setAutoPadding(false);
  // copy the output of encrypt.php and paste it below
  var dec = cipher.update(data,'utf8','base64');

  //decrypted data is stored in dec
  dec += cipher.final('base64');
  console.log('123');
  if (cb) {
   return  cb(null, dec);
  }
  return dec;
}
