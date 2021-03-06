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
    "query-qrcode": "/jquery-qrcode/jquery.qrcode.min"
  },
  shim: {　　　　
    'bootstrap': {
      deps: ['jquery']　
    },
    'dynatable': {
      deps: ['jquery']　
    },
    'query-qrcode': {
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
    'jquery.simplePagination', 'momentjs', 'query-qrcode'
  ],
  function(_, $) {
    init(_, $);
  });

var pagerInfoUrl = '/admin/catalog/pagerinfo';
var pagerlistUrl = '/admin/catalog/pagerlist';
var detailUrl = '/admin/catalog/detail';
var updateUrl = '/admin/catalog/update';
var delUrl = '/admin/catalog/del';
var delMultiUrl = '/admin/catalog/delmulti';
var cols = ['序号', '编号', '名称', '备注', '图片管理', ''];

var pageIndex = 0;
var C_PageSize = 10;

var init = function(_, $) {
  $(function() {
    initMultiDel();
    //MenuActive
    $(function() {
      $('#menuCatalog').addClass('active');
    });
    _.each(cols, function(ele, idx) {
      $('.cols').append('<th>' + ele + '</th>');
    });
    //初始化控件======================
    var initUpdateForm = function() {
      $("form#saveForm :input[name=_id]").val("");
      $("form#saveForm :input[type=text]").each(function() {
        var input = $(this).val("");
      });
      $("form#saveForm textarea").each(function() {
        var input = $(this).val("");
      });
    }
    //添加触发
    $(function() {
      $("#btnAdd").on('click', function() {
        $("#btnDel").hide();
        initUpdateForm();
      });
      $("#btnMultiDel").on('click', function() {

      });
    });
    //列表数据显示
    $(function() {
      $("#btnSearch").click(function() {
        pager_init();
      });
      $("#sKeyword").on("click", function() {
        $(this).select();
      });
      pager_init();
    });

    function pager_init() {
      $("#pagerContainer").html('');
      $.ajax({
        type: 'GET',
        url: pagerInfoUrl,
        dataType: 'json',
        data: {
          "sKeyword": $("#sKeyword").val()
        },
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
        url: pagerlistUrl,
        dataType: 'json',
        data: {
          "pageSize": C_PageSize,
          "pageIndex": pageNumber - 1,
          "sKeyword": $("#sKeyword").val()
        },
        cache: false,
        error: function() {
          alert('出错了！');
        },
        success: function(data) {
          var htmlContent = ""
          var iIndex = 1;
          $(".dataRows").html("");
          $.each(data.result, function(index, value) {
            htmlContent = fillRowData(index, value);
            var jObj = $(htmlContent);
            $(".dataRows").append(jObj);
            popoverQRCodeInit(jObj.find('button:last'));
          });

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
      trHtml += "<td>" + value['code'] + "</td >";
      trHtml += "<td>" + value['name'] + "</td >";
      trHtml += "<td>" + value['desc'] + "</td >";
      trHtml += '<td><a  href="/admin/' + value['_id'] + '/product' + '">图片管理</a></td>';
      trHtml += '<td><button class="btn btn-xs btn-primary" data="' + value["_id"] +
        '" onclick="javascript: popoverQRCode(\'' +
        value["_id"] + '\')">二维码</button></td>';
      trHtml += "</tr>";
      return trHtml;
    };

    //存======================
    $(function() {
      $('#saveForm').ajaxForm({
        dataType: 'json',
        url: updateUrl,
        beforeSubmit: function(formData, jqForm, options) {
          var queryString = $.param(formData);
          //alert('About to submit: \n\n' + queryString);
          return true;
        },
        success: function(jsonData) {
          if (jsonData.code > 0) {
            alert(jsonData.msg);
          } else {
            loadListData(1);
            $("#myModal").modal("hide");
          }
        }
      });
    });
    //删======================
    $(function() {
      $("#btnDelYes").click(function() {
        $.ajax({
          type: 'POST',
          url: delUrl,
          dataType: 'json',
          data: {
            "_id": $("form#saveForm :input[name=_id]").val(),
          },
          cache: false,
          error: function() {
            alert('出错了！');
          },
          success: function(jsonD) {
            loadListData(1);
            $("#myModal").modal("hide");
            $("#myConfirmModal").modal("hide");
          }
        });
      })
    });

  });
}; //init

//查======================
var beginEdit = function(itemID) {
  $.getJSON(detailUrl, {
    _id: itemID,
  }).fail(function() {
    alert('出错了！');
  }).done(function(data) {
    if (data.code > 0) {
      alert(data.msg);
      return;
    }
    $("form#saveForm :input").each(function() {
      var name = $(this).attr("name");
      if (data.result[name] != null) {
        $(this).val(data.result[name]);
      }
    });
    $("#btnDelYes").show();
    $("#myModal").modal("show");
  });
}
//查======================
var popoverQRCodeInit = function(jObj) {
  var itemID = jObj.attr('data');
  var options = {
    html: true,
    animation: false,
    placement: top,
    title: '二维码',
    content: '<div id="qrcode' + itemID + '"></div>'
  };
  var myPop = jObj.popover(options);

  myPop.on('shown.bs.popover', function() {
    var qrcontent = window.location.origin +'/' + 'API/QRCode/' + itemID;
    $('#qrcode' + itemID).qrcode({
      width: 128,
      height: 128,
      text: qrcontent
    });
  })
}
var popoverQRCode = function(itemID) {

}

//搜索功能
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
      url: delMultiUrl,
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
