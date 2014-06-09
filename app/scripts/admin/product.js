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
    "jquery.form": "/jquery-form/jquery.form",
    "WebUploader": "/webuploader/dist/webuploader",
  },
  shim: {　　　　
    'bootstrap': {
      deps: ['jquery']　
    },
    'WebUploader': {
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

require(["underscore", "jquery", 'WebUploader', "bootstrap", "dynatable", "x-editable", "hotkeys",
    "jquery.form",
    'jquery.simplePagination', 'momentjs'
  ],
  function(_, $, WebUploader) {
    init(_, $, WebUploader);
  });

var pagerInfoUrl = '/admin/:catalogId/product/pagerinfo';
var pagerlistUrl = '/admin/:catalogId/product/pagerlist';
var delUrl = '/admin/:catalogId/product/del';
var delMultiUrl = '/admin/prodrctdelmulti';//'/admin/:catalogId/product/delmulti';
var uploadUrl = '/admin/:catalogId/product/upload';

var cols = ['序号', '时间', '图片地址'];

var pageIndex = 0;
var C_PageSize = 10;
var catalogId = null;
var uploader = null;
var init = function(_, $, WebUploader) {
  $(function() {
    catalogId = $('#pageId').val();
    initWebUpload(WebUploader);
    initMultiDel();
    //MenuActive
    $(function() {
      $('#menuProduct').addClass('active');
    });
    _.each(cols, function(ele, idx) {
      $('.cols').append('<th>' + ele + '</th>');
    });
    pager_init();

    function pager_init() {
      $("#pagerContainer").html('');
      $.ajax({
        type: 'GET',
        url: pagerInfoUrl.replace(':catalogId', catalogId),
        dataType: 'json',
        data: {},
        cache: false,
        error: function() {
          alert('出错了！');
        },
        success: function(data) {
          var count = data.result.count;
          var onePageItemCount = data.result.onePageItemCount;
          $('#pagerContainer').pagination({
            items: count,
            itemsOnPage: onePageItemCount,
            cssStyle: 'light-theme',
            onPageClick: function(pageNumber, event) {
              loadListData(pageNumber);
            },
            onInit: function() {
              loadListData(1);
            }
          });
        }
      });
    }

    function loadListData(pageNumber) {
      pageIndex = pageNumber;
      $.ajax({
        type: 'GET',
        url: pagerlistUrl.replace(':catalogId', catalogId),
        dataType: 'json',
        data: {
          "pageSize": C_PageSize,
          "pageIndex": pageNumber - 1
        },
        cache: false,
        error: function() {
          alert('出错了！');
        },
        success: function(data) {
          var htmlContent = ""
          var iIndex = 1;
          $.each(data.result, function(index, value) {
            htmlContent += fillRowData(index, value);
          });
          $(".dataRows").html("").html(htmlContent);
          attachMultiDel();
        }
      });
    }
    //填充列表数据
    var fillRowData = function(iIndex, value) {
      var trHtml = '<tr>';
      trHtml += "<td><input type='checkbox'></td>";
      trHtml += '<td><button class="btn btn-xs btn-primary" onclick="javascript: beginEdit(\'' +
        value["_id"] + '\')">详细</button></td>';
      trHtml += "<td>" + ((pageIndex - 1) * C_PageSize + (++iIndex)) + "</td>";
      trHtml += "<td>" + value['create'] + "</td >";
      trHtml += "<td><img width=100 height=100 src='" + value['imageurl'] + "'/>" + "</td >";
      trHtml += "</tr>";
      return trHtml;
    };
  });
};
//http://fex.baidu.com/webuploader/getting-started.html
var initWebUpload = function(WebUploader) {
  uploader = WebUploader.create({
    auto: true,
    swf: 'http://cdn.bootcss.com/webuploader/0.1.0/Uploader.swf',
    server: uploadUrl.replace(':catalogId', catalogId),
    pick: '#btnAdd',
    resize: false,
    accept: {
      title: 'Images',
      extensions: 'gif,jpg,jpeg,bmp,png',
      mimeTypes: 'image/*'
    }
  });
  // 当有文件被添加进队列的时候
  uploader.on('fileQueued', function(file) {});
  uploader.on('uploadProgress', function(file, percentage) {});
  uploader.on('uploadSuccess', function(file) {
    alert('已上传');
  });
  uploader.on('uploadError', function(file) {
    alert('上传出错');
  });
  uploader.on('uploadComplete', function(file) {});
}

//
var initMultiDel = function() {
  $("#btnMultiCheckSwitch").on("change", function() {
    var isChk = this.checked;
    var checkedlist = $('.dataRows :input[type=checkbox]');
    for (var i = 0; i < checkedlist.length; i++) {
      checkedlist[i].checked = isChk;
    }
    if (!isChk) {
      $("#btnMultiDel").addClass('disabled');
    } else {
      $("#btnMultiDel").removeClass('disabled');
    }
  });

  $("#btnMultiDel").on("click", function() {
    var checkedlist = $('.dataRows :input[type=checkbox]:checked');
    var list = [];
    for (var i = 0; i < checkedlist.length; i++) {
      var $obj = $(checkedlist[i]).parent().parent().find('button')
      var detailID = $obj.attr('onclick').match(/\(\'(.*?)\'\)/)[1];
      list.push(detailID)
    };
    if (list.length == 0) {
      return;
    };
    $.ajax({
      type: 'POST',
      url: delMultiUrl.replace(':catalogId', catalogId),
      dataType: 'json',
      data: {
        "detailIDs": list.toString(),
      },
      cache: false,
      error: function() {
        alert('出错了！');
      },
      success: function(jsonD) {
        //only remove items?
        $("#btnMultiCheckSwitch")[0].checked = false;
        for (var i = 0; i < checkedlist.length; i++) {
          var $obj = $(checkedlist[i]).parent().parent();
          $obj.remove();
        };
        setTimeout(function() {
          pager_init();
        }, 1000);
      }
    });
  });
}
var attachMultiDel = function() {
  $("#btnMultiDel").addClass('disabled');
  $(".dataRows :input[type=checkbox]").on("change", function() {
    var checkedlist = $('.dataRows :input[type=checkbox]:checked');
    var isChk = this.checked;
    if (!isChk) {
      $("#btnMultiCheckSwitch")[0].checked = false;
    } else { //if is all checked
      var list = $('.dataRows :input[type=checkbox]');
      $("#btnMultiCheckSwitch")[0].checked = (checkedlist.length == list.length);
    }
    if (checkedlist.length == 0) {
      $("#btnMultiDel").addClass('disabled');
    } else {
      $("#btnMultiDel").removeClass('disabled');
    }
  });
}
