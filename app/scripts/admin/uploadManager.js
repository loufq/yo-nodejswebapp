require.config({　　　　
  paths: {　　　　　　
    "jquery": "/jquery/dist/jquery.min",
    "bootstrap": "/bootstrap/dist/js/bootstrap.min",
    "dynatable": "/dynatable/jquery.dynatable",
    "x-editable": "/x-editable/dist/bootstrap3-editable/js/bootstrap-editable.min",
    "jquery.simplePagination": "/jquery.simplePagination/jquery.simplePagination",
    "underscore": "/underscore/underscore",
    "jquery.lazyload": "/jquery.lazyload/jquery.lazyload.min",
    "scrollup": "/scrollup/js/jquery.scrollUp.min",
    "hotkeys": "/jquery.hotkeys/jquery.hotkeys",
    "momentjs": "/momentjs/moment",
    "jquery.form": "/jquery-form/jquery.form"
  },
  shim: {　　　　
    'bootstrap': {
      deps: ['jquery']　
    },
    'dynatable': {
      deps: ['jquery']　
    },
    'x-editable': {
      deps: ['jquery']　
    },
    'jquery.lazyload': {
      deps: ['jquery']　
    },
    'scrollup': {　　　　　　
      deps: ['jquery']　
    },
    'hotkeys': {　　　　　　
      deps: ['jquery']　
    },
    'jquery.form': {　　　　　　
      deps: ['jquery']　
    },
    'jquery.simplePagination': {　　　　　　
      deps: ['jquery']　
    },
  }
});

require(["underscore", "jquery", "bootstrap", "dynatable", "x-editable", "hotkeys", "jquery.form",
'jquery.simplePagination', 'momentjs'
],
function(_, $) {
  init(_, $);
});


var cols = ['序号', '类型', '用户ID', '时间', '备注'];

var pageIndex = 0;
var C_PageSize = 10;

var init = function(_, $) {
  $(function() {
    //MenuActive
    $(function() {
      $('#menuUploadManager').addClass('active');
    });
  });
}; //init
