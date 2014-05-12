yo nodejsapp
=========
nodejs应用开发基本环境设置
用 yo webapp 生成的框架基础上改造成 nodejs使用的app，
同时在后段集成了koa，在前端集成了requirejs.

下载后：
-------------
```shell
//1.
koa-start/bower
//2.
koa-start/app/npm install
//3.
node --harmony app.js 
//or use nodemon[npm install -g nodemon] 
nodemon app.js
```

[nodemon](https://github.com/remy/nodemon)

后续集成功能：
-------------
- DB:mongoose 
- 管理员后台
- 用户帐号管理
- 通用列表页面管理（主次层级区分的内容管理 catalog/product）
- 图片上传管理 [参考](https://github.com/arvindr21/expressjs-fileupload)









